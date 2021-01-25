import _ from 'underscore';
/**
 * @returns {{initialize: Function, focus: Function, blur: Function}}
 */
geotab.addin.sygic = function (api, state) {
  'use strict';

  const addinDataGuid = 'ajk3ZmUzNmQtYjNlYS0yMGI';

  (function () {
    // Date.prototype.format() - By Chris West - MIT Licensed
    let D = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      M = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
    Date.prototype.format = function (format) {
      let me = this;
      return format.replace(/a|A|Z|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, function (str) {
        let c1 = str.charAt(0),
          ret = str.charAt(0) == '\'' ? (c1 = 0) || str.slice(1, -1).replace(/''/g, '\'') : str == 'a' ? (me.getHours() < 12 ? 'am' : 'pm') : str == 'A' ? (me.getHours() < 12 ? 'AM' : 'PM') : str == 'Z' ? (('+' + -me.getTimezoneOffset() / 60).replace(/^\D?(\D)/, '$1').replace(/^(.)(.)$/, '$10$2') + '00') : c1 == 'S' ? me.getMilliseconds() : c1 == 's' ? me.getSeconds() : c1 == 'H' ? me.getHours() : c1 == 'h' ? (me.getHours() % 12) || 12 : (c1 == 'D' && str.length > 2) ? D[me.getDay()].slice(0, str.length > 3 ? 9 : 3) : c1 == 'D' ? me.getDate() : (c1 == 'M' && str.length > 2) ? M[me.getMonth()].slice(0, str.length > 3 ? 9 : 3) : c1 == 'm' ? me.getMinutes() : c1 == 'M' ? me.getMonth() + 1 : ('' + me.getFullYear()).slice(-str.length);
        return c1 && str.length < 4 && ('' + ret).length < str.length ? ('00' + ret).slice(-str.length) : ret;
      });
    };
    Date.prototype.toHoursMins = function () {
      return this.toTimeString().slice(0, 5);
    }
    Date.prototype.dateAdd = function (interval, units) {
      let ret = new Date(this); //don't change original date
      let checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
      switch (interval.toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
      }
      return ret;
    };
    Date.prototype.addMinutes = function (minutes) {
      return this.dateAdd('minute', minutes);
    }
  })();

  let dimensionsFormTemplate = `
  <% for (const key in obj) { %>
    <% if (obj.hasOwnProperty(key)) { %>
      <%  let dimension_label = obj[key].label; %>
      <%  let value = obj[key].value; %>
      <label for='sygic-truck-<%= key %>' class='form-input'>
      <%= dimension_label %>
      <input type='number' name='sygic-truck-<%= key %>' value='<%= value %>' class='form-input' />
      </label>
  <% }} %>
  `;
  let dimensionsDataTemplate = `
  <% for (const key in obj) { %>
    <% if (obj.hasOwnProperty(key)) { %>
      <%  let dimension_label = obj[key].label; %>
      <%  let value = obj[key].value; %>
    <tr><th><%= dimension_label %></th><td><%= value %></td></tr> 
  <% }} %>
  `;

  // the root container
  let elAddin = document.getElementById('sygic-app');

  //make use of async/await instead of callbacks
  let geotabApi = {
    callAsync: (method, parameters) => new Promise((resolve, reject) => { api.call(method, parameters, result => resolve(result), err => reject(err)) }),
    getSessionAsync: () => new Promise((resolve, reject) => { api.getSession(session => { resolve(session); }) })
  };

  let myDimensions = null;

  function getEmptyDimensions() {
    return {
      width: undefined,
      height: undefined,
      total_weight: undefined,
      axle_weight: undefined,
      total_length: undefined,
    }
  }

  function getDimensionsLabels() {
    return {
      width: 'Width (mm)',
      height: 'Height (mm)',
      total_weight: 'Total weight (kg)',
      axle_weight: 'Axle weight (kg)',
      total_length: 'Total length (mm)',
    }
  }

  function populateDimensions(dimensions) {
    let summaryTemplate = _.template(dimensionsDataTemplate);
    let formTemplate = _.template(dimensionsFormTemplate);
    let summaryTemplateObject = {};
    let labels = getDimensionsLabels();
    for (const key in dimensions) {
      const value = dimensions[key];
      summaryTemplateObject[key] = {
        value: value,
        label: labels[key]
      }
    }
    document.getElementById('sygic-dimensions-summary-content').innerHTML = summaryTemplate(summaryTemplateObject);
    document.getElementById('sygic-dimensions-form-content').innerHTML = formTemplate(summaryTemplateObject);
  }

  function getDimensionInputValues(parentElement) {
    let emptyDimensions = getEmptyDimensions();
    for (const key in emptyDimensions) {
      emptyDimensions[key] = parentElement.querySelector(`input[name=sygic-truck-${key}]`).value;
    }
    return emptyDimensions;
  }

  function toggleDimensionsBox(){
    document.getElementById('sygic-dimensions-form').classList.toggle('hidden');
    document.getElementById('sygic-dimensions-summary').classList.toggle('hidden');
  }

  function createElement(tag, options = {}, parent = null){
    let el = document.createElement(tag);
    (options.classes || []).forEach(c => {
      el.classList.add(c)
    });
    if (options.content) {
      el.appendChild(document.createTextNode(options.content))
    }
    if (options.style){
      el.style = options.style;
    }
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  }

  function createSygicUri(lat, lon){
    let uri = `com.sygic.aura://coordinate|${lon}|${lat}|drive`;

    let dimensionsUri = 'truckSettings';
    let dimensions = getDimensionInputValues(elAddin);
    if (dimensions.total_weight){
      dimensionsUri+=`|wei=${dimensions.total_weight}`;
    }
    if (dimensions.axle_weight){
      dimensionsUri+=`|axl=${dimensions.axle_weight}`;
    }
    if (dimensions.total_length){
      dimensionsUri+=`|len=${dimensions.total_length}`;
    }
    if (dimensions.width){
      dimensionsUri+=`|wid=${dimensions.width}`;
    }
    if (dimensions.height){
      dimensionsUri+=`|hei=${dimensions.height}`;
    }

    if (dimensionsUri.length > 13){
      uri += `&&&${dimensionsUri}|rou=tru`;
    }
    let location = encodeURI(uri);
    return location;
  }

  async function loadDevice(deviceId) {
    let devices = await geotabApi.callAsync('Get', {
      typeName: 'Device',
      search: {
        id: deviceId
      }
    });
    let device = devices[0];
    elAddin.querySelector('#sygic-vehicle').textContent = device.name;
    return device;
  }

  function formatStopDate(stopDateString){
    let stopDate = new Date(stopDateString);
    return `at ${stopDate.format('HH:mm')} on ${stopDate.format('DD.MM')}`
  }

  async function loadTrips(device) {
    let today = new Date();
    today.setHours(0,0,0);
    let myRoutes = await geotabApi.callAsync('Get', {
      typeName: 'Route',
      search: {
        routeType: 'Plan',
        fromDate: today,
        deviceSearch: {
          id: device.id
        }
      }
    });

    let tripsContainer = elAddin.querySelector('#sygic-my-trips');
    tripsContainer.innerHTML = '';
    
    myRoutes.forEach(async route => {
      let routeListItem = createElement('li', {
        classes: ['menu-list__item']
      }, tripsContainer);

      let container = createElement('div', {
        style: 'flex-direction: column;'
      }, routeListItem)

      createElement('div', {
        content: route.name
      }, container)

      let firstStop = route.routePlanItemCollection[0];

      createElement('div', {
        content: `${route.routePlanItemCollection.length} stops, first stop ${formatStopDate(firstStop.activeFrom)}`,
        classes: ['caption']
      }, container);

      let table = createElement('table', {
        classes: ['data-table', 'hidden']
      }, container);

      routeListItem.addEventListener('click', async event => {
        event.preventDefault();

        if (table.classList.contains('hidden')) {
          for (let index = 0; index < route.routePlanItemCollection.length; index++) {
            const stop = route.routePlanItemCollection[index];
            let results = await geotabApi.callAsync('Get', {
              typeName: 'Zone',
              search: {
                id: stop.zone.id
              }
            });
            let zone = results[0]
            let tr = createElement('tr', {}, table);
            tr.addEventListener('click', event => {
              event.preventDefault();
              event.stopPropagation();
            });
            let td = createElement('td', {}, tr)
            let a = createElement('a', {
              content: `${index + 1}. ${zone.name}`
            }, td);

            createElement('div', {
              content: `${formatStopDate(stop.activeFrom)}`,
              classes: ['caption']
            }, td);

            let lat = zone.points[0].y;
            let lon = zone.points[0].x;

            a.setAttribute('href', '#');
            a.addEventListener('click', event => {
              event.preventDefault();
              let location = createSygicUri(lat, lon);
              window.open(location, '_system')
            })
          }
        } else {
          table.innerHTML = '';
        }
        table.classList.toggle('hidden');
      })
    });
  }

  async  function loadDimensions(device){
    let storage = new dimensionsStorage(device.id);
    let myDimensions = await storage.getDimensionsAsync();
    if (!myDimensions) {
      populateDimensions(getEmptyDimensions())
    } else {
      populateDimensions(myDimensions.dimensions);
    }

    return myDimensions;
  }

  function dimensionsStorage(vehicle_id){
    const id = vehicle_id;
    return {
      getDimensionsAsync: async () => {
        let result = await geotabApi.callAsync('Get',{
          typeName: 'AddInData',
          search: {
            addInId: addinDataGuid,
            whereClause: `vehicle_id=\"${id}\"`
          }
        });
        if (result && result.length > 0){
          let item = result[0];
          return {
            dimensions: JSON.parse(item.data).dimensions,
            id: item.id
          };
        }
      },
      addDimensionsAsync: async (dimensions) => {
        let result = await geotabApi.callAsync('Add', {
          typeName: 'AddInData',
          entity: {
            addInId: addinDataGuid,
            data: JSON.stringify({
              vehicle_id: id,
              dimensions: dimensions
            })
          }
        });
        return result;
      },
      setDimensionsAsync: async (dimensions, dimensionsId) => await geotabApi.callAsync('Set', {
        typeName: 'AddInData',
        entity: {
          addInId: addinDataGuid,
          id: dimensionsId,
          data: JSON.stringify({
            vehicle_id: id,
            dimensions: dimensions
          })
        }
      })
    }
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

      document.getElementById('sygic-edit-dimensions').addEventListener('click', event => {
        event.preventDefault();
        toggleDimensionsBox();
      })
  
      document.getElementById('sygic-save-dimensions').addEventListener('click', async event => {
        event.preventDefault();

        let storage = new dimensionsStorage(freshState.device.id);
        let dimensionsInputs = getDimensionInputValues(elAddin);
        if (myDimensions) {
          try {
            await storage.setDimensionsAsync(dimensionsInputs, myDimensions.id);
          } catch (e) {
            //don't know what is going on there, but there is an error when updating
          }
        } else {         
          await storage.addDimensionsAsync(dimensionsInputs)
        }
        myDimensions = await loadDimensions(freshState.device)
        toggleDimensionsBox();
      })

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
      let device = await loadDevice(freshState.device.id);
      await loadTrips(device);
      myDimensions = await loadDimensions(device);

      //show main content
      elAddin.className = elAddin.className.replace('hidden', '').trim();
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
    }
  };
};
