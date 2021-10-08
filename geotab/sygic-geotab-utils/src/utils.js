import _ from 'underscore';

const Filters = (() => {
  let RequiredEditFilters = ['DeviceAdmin', 'ManageAddInData'];
  let RequiredViewFilters = ['DeviceList', 'ViewAddInData'];
  let Joker = 'Everything';
  return {
    All: RequiredEditFilters.concat(RequiredViewFilters).concat(Joker),
    RequiredEditFilters,
    RequiredViewFilters,
    Joker
  };
})();

class RequiredFilters {
  constructor(requiredFiltersArray) {
    this.requiredFilters = Object.assign(
      {},
      ...requiredFiltersArray.map((a) => ({ [a]: undefined }))
    );
  }

  setAllowed(filter, value) {
    if (this.requiredFilters[filter] === undefined) {
      this.requiredFilters[filter] = value;
      return true;
    }
    return false;
  }

  isInitialized() {
    return (
      _.every(this.requiredFilters, (f) => f !== undefined) ||
      this.requiredFilters[Filters.Joker] === true
    );
  }

  hasAllRequiredFilters() {
    return (
      _.every(this.requiredFilters, (f) => f === true) ||
      this.requiredFilters[Filters.Joker] === true
    );
  }
}

export class User {
  constructor(geotabUser, allSecurityGroups) {
    this.canView = false;
    this.canModify = false;
    let userSecurityGroups = geotabUser.securityGroups.map((g) => g.id);
    if (userSecurityGroups.length > 0) {
      let securityGroupDetail = _.find(
        allSecurityGroups,
        (c) => c.id === userSecurityGroups[0]
      );
      this.buildPermissionTree(allSecurityGroups, securityGroupDetail);
      this.canModify = this.hasClearanceInTree(
        securityGroupDetail,
        Filters.RequiredEditFilters
      );
      this.canView = this.hasClearanceInTree(
        securityGroupDetail,
        Filters.RequiredViewFilters
      );
    }
  }

  //purely for debugging purposes and convenience
  stripRedundantData(securityGroup) {
    if (securityGroup) {
      if (securityGroup.securityFilters)
        securityGroup.securityFilters = _.filter(
          securityGroup.securityFilters,
          (f) => Filters.All.includes(f.securityIdentifier)
        );
      if (securityGroup.color) delete securityGroup.color;
      if (securityGroup.reference) delete securityGroup.reference;
      if (securityGroup.comments) delete securityGroup.comments;
    }
  }

  getAndAssignParent(allSecurityGroups, securityGroup) {
    this.stripRedundantData(securityGroup);
    const parent = _.find(allSecurityGroups, (c) => {
      return _.find(c.children, (c) => c.id === securityGroup.id);
    });
    securityGroup.parent = parent;
    return parent;
  }

  buildPermissionTree(allSecurityGroups, securityGroup) {
    let parent = this.getAndAssignParent(allSecurityGroups, securityGroup);
    while (parent) {
      parent = this.getAndAssignParent(allSecurityGroups, parent);
    }
  }

  hasClearanceInTree(securityGroup, requiredSecurityFilter, cb) {
    let parent = securityGroup;
    let requiredFilters = new RequiredFilters(requiredSecurityFilter);

    while (parent && !requiredFilters.isInitialized()) {
      let filtersFor = _.filter(
        parent.securityFilters,
        (f) =>
          requiredSecurityFilter.includes(f.securityIdentifier) ||
          f.securityIdentifier === Filters.Joker
      );

      _.each(filtersFor, (filter) => {
        requiredFilters.setAllowed(filter.securityIdentifier, filter.isAdd);
      });
      parent = parent.parent;
    }
    return requiredFilters.hasAllRequiredFilters();
  }
}

export function ApiWrapper(api) {
  // make use of async/await instead of callbacks
  return {
    callAsync: (method, parameters) =>
      new Promise((resolve, reject) => {
        api.call(
          method,
          parameters,
          (result) => resolve(result),
          (err) => reject(err)
        );
      }),
    getSessionAsync: () =>
      new Promise((resolve, reject) => {
        api.getSession((session) => {
          resolve(session);
        });
      }),
  };
}

export let Dimensions = {
  getEmpty: () => ({
    width: undefined,
    height: undefined,
    total_weight: undefined,
    axle_weight: undefined,
    total_length: undefined,
  }),
  getLabels: (state) => ({
    width: state.translate('Width (mm)'),
    height: state.translate('Height (mm)'),
    total_weight: state.translate('Total weight (kg)'),
    axle_weight: state.translate('Axle weight (kg)'),
    total_length: state.translate('Total length (mm)'),
  }),
  getInputValues: (parentElement) => {
    let emptyDimensions = Dimensions.getEmpty();
    for (const key in emptyDimensions) {
      if (emptyDimensions.hasOwnProperty(key)) {
        emptyDimensions[key] = parentElement.querySelector(
          `input[name=sygic-truck-${key}]`
        ).value;
      }
    }
    return emptyDimensions;
  },
};

export function DimensionsStorage(geotabApi) {
  const addinDataGuid = 'ajk3ZmUzNmQtYjNlYS0yMGI';
  return {
    getAllDimensionsAsync: async () => {
      let result = await geotabApi.callAsync('Get', {
        typeName: 'AddInData',
        search: {
          addInId: addinDataGuid,
        },
      });
      console.log(result)
      return result;
    },
    getDimensionsAsync: async (vehicleId) => {
      let result = await geotabApi.callAsync('Get', {
        typeName: 'AddInData',
        search: {
          addInId: addinDataGuid,
          whereClause: `vehicle_id=\"${vehicleId}\"`,
        },
      });
      if (result && result.length > 0) {
        let item = result[0];
        return {
          dimensions: item.details.dimensions,
          id: item.id,
        };
      }
    },
    addDimensionsAsync: async (dimensions, vehicleId) => {
      let result = await geotabApi.callAsync('Add', {
        typeName: 'AddInData',
        entity: {
          addInId: addinDataGuid,
          details: {
            vehicle_id: vehicleId,
            dimensions: dimensions,
          }
        }
      });
      return result;
    },
    setDimensionsAsync: async (dimensions, dimensionsId, vehicleId) =>
      await geotabApi.callAsync('Set', {
        typeName: 'AddInData',
        entity: {
          addInId: addinDataGuid,
          id: dimensionsId,
          details: {
            vehicle_id: vehicleId,
            dimensions: dimensions,
          }
        }
      })
  };
}
