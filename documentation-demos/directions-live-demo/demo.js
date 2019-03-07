window.onload = function () {
    let apiKey = getApiKey();

    /* initialize map */
    let map = L.map("map");
    let latLngClicked;

    map.on('contextmenu', function(e,b) {
        L.popup().setLatLng(e.latlng)
        .setContent("<ul class='context-menu'>" + 
                        "<li><a id='from-here'><i class='fa fa-flag'></i> Directions from here</a></li>"+
                        "<li><a id='to-here'><i class='fa fa-flag-checkered'></i> Directions to here</a></li>"+
                    "</ul>").openOn(map);
        latLngClicked = e.latlng;         
        tempAlert(coordsToString(e.latlng));
    });

    let sygicTileLayer = L.TileLayer.sygic(apiKey);
    let incidentLayer = L.TileLayer.sygicIncident(apiKey);
    let restrictionLayer = L.TileLayer.sygicRestriction(apiKey);
    let sateliteLayer = L.TileLayer.sygicSatellite(apiKey, { detectRetina: false });
    let trafficLayer = new L.TileLayer.sygicTraffic(apiKey, {
        trafficControl: true
    });
    let poiLayer = L.TileLayer.sygicPoi(apiKey);
    let baseMaps = { 'Map': sygicTileLayer, 'Satelite': sateliteLayer };

    let overlayMaps = {
        'Poi': poiLayer,
        'Restriction': restrictionLayer,
        'Traffic': trafficLayer,
        'Incident': incidentLayer
    };

    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

    L.layerGroup([sygicTileLayer, incidentLayer, poiLayer, restrictionLayer]).addTo(map);

    let responseLayer;

    /* REQUEST BODY */
    let request = {
        origin: "48.1464,17.10687",
        destination: "49.00254,21.23971",
        compute_alternatives: true
    };
    
    /* call directions api, display on map */
    let compute = function (request) {
        //call sygic directions api
        $.post('https://routing.api.sygic.com/v0/api/directions?key=' + apiKey, request).done(function (response) {
            if (response.routes.length > 0) {
                let boundsCoords = [];
                //remove if map already has leayer rendered (in case of drag'n'dropping pins)
                if (responseLayer) map.removeLayer(responseLayer);

                responseLayer = L.layerGroup([]).addTo(map);
                for (let i = 0; i < response.routes.length; i++) {
                    let route = response.routes[i];

                    //create leaflet polyline object from api response
                    let polyline = L.Polyline.fromEncoded(route.route, {
                        color: i == 0 ? 'purple' : 'gray',
                        weight: 5,
                        smoothFactor: 1,
                        opacity: i == 0 ? 1 : 0.7
                    }).addTo(responseLayer);                    
                    let coords = polyline.getLatLngs();

                    if (i == 0) {
                        createMarker(coords[0], "origin").addTo(responseLayer);
                        createMarker(coords[coords.length - 1], "destination").addTo(responseLayer);
                    }
                    boundsCoords = boundsCoords.concat(coords);
                }
                let bounds = new L.LatLngBounds(boundsCoords);
                map.fitBounds(bounds);
            } else {
                alert("NO_RESULTS");
            }
        });
    };

    compute(request);

    /* utils */
    let createMarker = function (coords, title) {
        let marker = L.marker(coords, {
            title: title,
            draggable: true
        });
        marker.on('dragend', function (evt) {
            let newCoords = coordsToString(evt.target.getLatLng());
            request[evt.target.options.title] = newCoords;
            compute(request);
        });
        return marker;
    };

    let tempAlert = function (msg, color, duration) {
        duration = duration || 2000;
        color = color || "lightgray";
        var el = document.createElement("div");
        el.setAttribute("style", `position:absolute;top:5%;left:50%;background-color:${color};z-index:999;padding:5px`);
        el.innerHTML = msg;
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, duration);
        document.body.appendChild(el);
    };

    $('body').on('click', '#from-here', function() {
        map.closePopup();
        tempAlert(coordsToString(latLngClicked));
        $.extend(request, {
            origin: coordsToString(latLngClicked)
        });
        compute(request);
    });

    $('body').on('click', '#to-here', function() {
        map.closePopup();
        tempAlert(coordsToString(latLngClicked));
        $.extend(request, {
            destination: coordsToString(latLngClicked)
        });
        compute(request);
    });

    let coordsToString = function (latlng) {
        return latlng.lat.toFixed(5) + "," + latlng.lng.toFixed(5);
    };
};