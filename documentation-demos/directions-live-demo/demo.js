window.onload = function () {
    let apiKey = getApiKey();

    let map = L.map("map");

    let sygicTileLayer = L.TileLayer.sygic(apiKey);
    let responseLayer;
    L.layerGroup([sygicTileLayer]).addTo(map);

    let request = {
        origin: "48.1464,17.10687",
        destination: "49.00254,21.23971",
        compute_alternatives: true
    };
    
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
                        opacity: i == 0 ? 1 : 0.5
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

    let createMarker = function (coords, title) {
        let marker = L.marker(coords, {
            title: title,
            draggable: true
        });
        marker.on('dragend', function (evt) {
            let newCoords = evt.target.getLatLng().lat.toFixed(5) + "," + evt.target.getLatLng().lng.toFixed(5);
            request[evt.target.options.title] = newCoords;
            compute(request);
        });
        return marker;
    };
};