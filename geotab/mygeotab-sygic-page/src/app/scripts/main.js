import _ from 'underscore';
import {
  User,
  ApiWrapper,
  Dimensions,
  DimensionsStorage,
} from 'sygic-geotab-utils';

/**
 * @returns {{initialize: Function, focus: Function, blur: Function}}
 */
geotab.addin.mygeotabSygicPage = function (api, state) {
  'use strict';
  const addinDataGuid = 'ajk3ZmUzNmQtYjNlYS0yMGI';

  // the root container
  var elAddin = document.getElementById('mygeotabSygicPage');
  let templateString = `
  <li class='<%= user.canView ? '' : ' hidden' %>'>
  <div class='g-col checkmateListBuilderRow sygic-vehicle' style='padding-left: 0px'>
    <input type='hidden' class='sygic-vehicle-id' value=<%= vehicle.id %>>
    <div class='g-row'>
        <div class='g-main g-main-col g-main_wider'>
          <div class='g-name'>
            <span class='ellipsis'><%= vehicle.name %></span>
          </div>
          <div class='g-comment'>
            <div class='secondaryData ellipsis'><%= vehicle_groups_string %></div>
          </div>
          <div class='g-comment vehicle-dimensions-comment'>
            <div class='secondaryData ellipsis'><%= vehicle_dimensions_string %></div>
          </div>
        </div>
      <div class='g-ctrl'>
        <a href='#' class='geotabButton geotabButton-empty sygic-edit-dimensions<%= user.canModify ? '' : ' hidden' %>'>
          <svg class='svgIcon geotabButtonIcons'><use xlink:href='#geo-pencil-icon'>
            <svg viewBox='0 0 32 32' id='geo-pencil-icon'><path d='M7.79 29.124l1.878-1.915-4.919-4.919-1.915 1.915v2.253h2.703v2.666H7.79zm10.927-19.45q0-.45-.45-.45-.189 0-.339.15L6.551 20.714q-.15.15-.15.375 0 .45.488.45.188 0 .338-.15l11.377-11.34q.113-.15.113-.375zM17.59 5.657l8.711 8.71L8.88 31.828H.17V23.08zm14.306 2.027q0 1.09-.751 1.878l-3.492 3.492-8.711-8.749L22.434.851q.75-.789 1.877-.789 1.09 0 1.915.789l4.919 4.918q.75.827.75 1.915z'></path></svg>
          </use></svg>
        </a>
      </div>
    </div>
    <div class='g-row hidden sygic-vehicle-dimensions-form'>
      <fieldset class='geotabFieldset sygic-vehicle-dimensions-fieldset' style='background-color: transparent'>
        <% _.each(vehicle_dimensions, dimension => { %>
            <%  let name = 'sygic-truck-' + dimension.key; %>
            <%  let value = dimension.value; %>
            <%  let label = dimension.label; %>
          <div class='geotabField'>
            <label for=<%= name %>><%= label %></label>
            <input type='number' name=<%= name %> class='geotabFormEditField' value=<%= value %> />
          </div>
        <% }) %>
        <button class='geotabButton sygic-vehicle-dimensions-save' >Apply changes</button>
      </fieldset>
    </div>
  </div>
</li>
  `;

  let geotabApi = ApiWrapper(api);

  function getDimensionsString(dimensionsObject) {
    let iterator = 0;
    let dimensionDetailsString = '';
    let labels = Dimensions.getLabels();
    for (const key in dimensionsObject) {
      if (dimensionsObject.hasOwnProperty(key)) {
        const value = dimensionsObject[key];
        if (iterator++ > 0) dimensionDetailsString += ', ';
        dimensionDetailsString += `${labels[key]}: ${value}`;
      }
    }
    return dimensionDetailsString;
  }

  function renderDeviceList(devices, dimensions, user) {
    let vehicleList = document.getElementById('sygic-vehicle-list');
    let storage = new DimensionsStorage(geotabApi);

    vehicleList.innerHTML = '';

    let dimensionsDict = Object.assign(
      {},
      ...dimensions.map((dimension) => {
        let data = JSON.parse(dimension.data);
        return {
          [data.vehicle_id]: data.dimensions,
        };
      })
    );

    let template = _.template(templateString);

    for (let index = 0; index < devices.length; index++) {
      const device = devices[index];
      let dimensionDetailsString = '';
      let baseDimensions = Dimensions.getEmpty();

      if (dimensionsDict[device.id]) {
        Object.assign(baseDimensions, dimensionsDict[device.id]);
        dimensionDetailsString = getDimensionsString(baseDimensions);
      } else {
        dimensionDetailsString = 'Dimensions unset';
      }

      let dimensionsTemplateObject = Object.keys(baseDimensions).map((key) => ({
        value: baseDimensions[key],
        key: key,
        label: Dimensions.getLabels()[key],
      }));

      let vehicle_groups_string = device.groups.map((c) => c.name).join(', ');
      let result = template({
        vehicle: device,
        vehicle_dimensions_string: dimensionDetailsString,
        vehicle_groups_string: vehicle_groups_string,
        vehicle_dimensions: dimensionsTemplateObject,
        user: user,
      });
      vehicleList.innerHTML += result;
    }

    let vehicleRows = document.querySelectorAll('.sygic-vehicle');
    vehicleRows.forEach((row) => {
      let deviceId = row.getElementsByClassName('sygic-vehicle-id')[0].value;
      let editAnchor = row.getElementsByClassName('sygic-edit-dimensions')[0];
      let form = row.getElementsByClassName('sygic-vehicle-dimensions-form')[0];
      let comment = row.getElementsByClassName('vehicle-dimensions-comment')[0];
      editAnchor.addEventListener('click', (event) => {
        event.preventDefault();
        comment.classList.toggle('hidden');
        form.classList.toggle('hidden');
      });

      let fieldSet = row.getElementsByClassName(
        'sygic-vehicle-dimensions-fieldset'
      )[0];
      let sumbitButton = row.getElementsByClassName(
        'sygic-vehicle-dimensions-save'
      )[0];
      sumbitButton.addEventListener('click', async (event) => {
        let inputValues = Dimensions.getInputValues(fieldSet);

        let storedDimensions = await storage.getDimensionsAsync(deviceId);
        if (!storedDimensions) {
          await storage.addDimensionsAsync(inputValues, deviceId);
        } else {
          try {
            await storage.setDimensionsAsync(
              inputValues,
              storedDimensions.id,
              deviceId
            );
          } catch (e) {
            //nothing here. It just fails for no reason.
          }
        }
        comment.classList.toggle('hidden');
        form.classList.toggle('hidden');
        comment.innerHTML = getDimensionsString(inputValues);
      });
    });
  }

  async function prepareData() {
    let storage = new DimensionsStorage(geotabApi);

    let devices = await geotabApi.callAsync('Get', {
      typeName: 'Device',
      search: {
        groups: state.getGroupFilter(),
      },
    });

    let groups = await geotabApi.callAsync('Get', {
      typeName: 'Group',
    });

    let groupMap = Object.assign(
      {},
      ...groups.map((group) => {
        return {
          [group.id]: group.name ? group.name : group.id,
        };
      })
    );

    devices.map((device) => {
      device.groups.map((group) => {
        group.name = groupMap[group.id];
      });
    });

    let dimensions = await storage.getAllDimensionsAsync();

    let session = await geotabApi.getSessionAsync();
    let geotabUser = await geotabApi.callAsync('Get', {
      typeName: 'User',
      search: {
        name: session.userName,
      },
    });

    const geotabClearances = await geotabApi.callAsync('Get', {
      typeName: 'Group',
      search: {
        id: 'groupSecurityId',
      },
    });

    let user = new User(geotabUser[0], geotabClearances);

    return { devices, dimensions, user };
  }

  return {
    /**
     * initialize() is called only once when the Add-In is first loaded. Use this function to initialize the
     * Add-In's state such as default values or make API requests (MyGeotab or external) to ensure interface
     * is ready for the user.
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     * @param {function} initializeCallback - Call this when your initialize route is complete. Since your initialize routine
     *        might be doing asynchronous operations, you must call this method when the Add-In is ready
     *        for display to the user.
     */
    initialize: async function (freshApi, freshState, initializeCallback) {
      // Loading translations if available
      if (freshState.translate) {
        freshState.translate(elAddin || '');
      }
      // MUST call initializeCallback when done any setup
      initializeCallback();
    },

    /**
     * focus() is called whenever the Add-In receives focus.
     *
     * The first time the user clicks on the Add-In menu, initialize() will be called and when completed, focus().
     * focus() will be called again when the Add-In is revisited. Note that focus() will also be called whenever
     * the global state of the MyGeotab application changes, for example, if the user changes the global group
     * filter in the UI.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    focus: async function (freshApi, freshState) {
      elAddin.className = '';
      // show main content

      let data = await prepareData();
      renderDeviceList(data.devices, data.dimensions, data.user);
    },

    /**
     * blur() is called whenever the user navigates away from the Add-In.
     *
     * Use this function to save the page state or commit changes to a data store or release memory.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    blur: function () {
      // hide main content
      elAddin.className += ' hidden';
    },
  };
};
