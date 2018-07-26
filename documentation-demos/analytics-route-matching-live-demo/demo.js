window.onload = function () {
    Lockr.prefix = "sygic";

    var apiKey = getApiKey();

    var examples = {
        "monaco": {
            coordinates: ["43.73756,7.42216", "43.73745,7.42170", "43.73737,7.42148", "43.73728,7.42127", "43.73713,7.42091", "43.73703,7.42067", "43.73693,7.42047", "43.73678,7.42025", "43.73669,7.42012", "43.73667,7.42009", "43.73650,7.41990", "43.73632,7.41970", "43.73618,7.41955", "43.73599,7.41933", "43.73583,7.41915", "43.73571,7.41900", "43.73545,7.41868", "43.73536,7.41859", "43.73528,7.41851", "43.73509,7.41834", "43.73485,7.41824", "43.73444,7.41820", "43.73395,7.41854", "43.73364,7.41859", "43.73378,7.41857", "43.73345,7.41869", "43.73322,7.41871", "43.73282,7.41886", "43.73261,7.41852", "43.73280,7.41786", "43.73272,7.41812", "43.73289,7.41747", "43.73308,7.41737", "43.73327,7.41751", "43.73352,7.41760", "43.73378,7.41753", "43.73409,7.41742", "43.73425,7.41721", "43.73405,7.41724", "43.73451,7.41710", "43.73461,7.41709", "43.73487,7.41709", "43.73494,7.41709", "43.73537,7.41732", "43.73560,7.41752", "43.73582,7.41775", "43.73598,7.41806", "43.73610,7.41849", "43.73626,7.41881", "43.73642,7.41902", "43.73664,7.41932", "43.73678,7.41963", "43.73703,7.41982", "43.73690,7.41947", "43.73684,7.41938", "43.73676,7.41927", "43.73666,7.41916", "43.73661,7.41900", "43.73658,7.41889", "43.73655,7.41876", "43.73645,7.41855", "43.73636,7.41836", "43.73632,7.41820", "43.73625,7.41796", "43.73627,7.41776", "43.73625,7.41752", "43.73601,7.41739", "43.73582,7.41707", "43.73586,7.41668", "43.73565,7.41663", "43.73542,7.41650", "43.73530,7.41644", "43.73516,7.41637", "43.73491,7.41630", "43.73475,7.41627", "43.73446,7.41623", "43.73431,7.41619", "43.73402,7.41608", "43.73376,7.41585", "43.73361,7.41568", "43.73347,7.41550", "43.73330,7.41531"],
            accuracies: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
        }
    }

    //initialization of sygic maps
    var map = L.map("map");

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var markers = L.layerGroup();
    var matchedRouteLayer = L.layerGroup();
    map.addLayer(markers);
    map.addLayer(matchedRouteLayer);


    function init(coordinatesOverride) {
        markers.clearLayers();
        let coordinates = coordinatesOverride || Lockr.get('coords');
        console.info("Stored coordinates: ", coordinates);
        if (coordinates) {
            var bounds = new L.LatLngBounds();
            coordinates.forEach(function (coordinate, index) {
                var latlng = coordsFromString(coordinate);
                addMarker(latlng, true, index + 1);
                bounds.extend(latlng);
            })
            map.fitBounds(bounds);
        } else {
            map.setView([48.146864, 17.105868], 14);
        }
    }
    init();

    L.control.layers(null, { "Markers": markers }, { collapsed: false }).addTo(map);

    (function () {
        let dropdown = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('select');
                var innerHTML = "<option value=''>--</option>";
                $.each(examples, function (key, value) {
                    let option = '<option value=' + key + '>' + key + '</option>';
                    innerHTML += option;
                });

                container.innerHTML = innerHTML;
                L.DomEvent.disableClickPropagation(container);
                container.onchange = function (a, b, c) {
                    if (this.value) {
                        init(examples[this.value].coordinates);
                    } else {
                        init();
                    }
                    console.log(this.value);
                }
                return container;
            },
        });
        map.addControl(new dropdown());
    })();

    function addButton(value, callback) {
        let button = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function (map) {
                var container = L.DomUtil.create('input');
                L.DomEvent.disableClickPropagation(container);
                container.type = "button";
                container.value = value;

                container.onclick = callback
                return container;
            },
        });
        map.addControl(new button());
    }
    addButton("Clear all", function (evt) {
        markers.clearLayers();
        matchedRouteLayer.clearLayers();
        Lockr.flush();
    });
    addButton("Compute", function () {
        let tmpMarkers = [];
        let markersLayers = markers._layers;
        for (let name in markersLayers) {
            if (markersLayers.hasOwnProperty(name)) {
                let marker = markersLayers[name];
                let latlng = marker._latlng.lat + "," + marker._latlng.lng;
                tmpMarkers.push(latlng);
            }
        }
        matchedRouteLayer.clearLayers();
        if (tmpMarkers && tmpMarkers.length > 1) {
            compute(tmpMarkers);
        } else {
            alert("Add some markers to the map!")
        }

    });

    function coordsToString(latlng) {
        return latlng.lat.toFixed(5) + "," + latlng.lng.toFixed(5);
    }

    function coordsFromString(latlngStr) {
        let split = latlngStr.split(',');
        return { lat: Number.parseFloat(split[0]), lng: Number.parseFloat(split[1]) };
    }

    function addMarker(coords, skipStorage, forceIndex) {
        let storedCoords = Lockr.get("coords");
        let index = storedCoords && (storedCoords.length + 1) || 1;
        let marker = L.marker(coords, {
            icon: new L.NumberedDivIcon({ number: forceIndex || index }),
            draggable: true,
            originalCoordinates: coords
        });

        marker.on('contextmenu', function () {
            Lockr.srem("coords", coordsToString(marker._latlng));
            init();
        });

        marker.on('dragend', function (evt) {
            //replace coordinate in storage
            let storedCoords = Lockr.get("coords");
            let originalCoords = coordsToString(evt.target.options.originalCoordinates);
            let originalIndex = storedCoords.indexOf(originalCoords);
            let newCoords = coordsToString(evt.target.getLatLng());
            storedCoords[originalIndex] = newCoords;
            Lockr.set("coords", storedCoords);
            init();
        });

        marker.addTo(markers);
        if (skipStorage) return;
        Lockr.sadd("coords", coordsToString(marker._latlng));
    }

    map.on('click',
        function (evt) {
            addMarker(evt.latlng);
        });

    var colors = [
        "#009fff", // blue for no speeding (0%)
        "#fdff00", // yellow for 10% speeding
        "#ff7400", // orange for 20% speeding
        "#f00", // red for 30% speeding
        "#000" // black for more
    ];

    function createPolyline(line, color) {
        let polyline = L.Polyline.fromEncoded(line, {
            color: color,
            weight: 5,
            smoothFactor: 1
        });
        return polyline;
    }

    function compute(coordinates) {
        $.post("https://analytics.api.sygic.com/v0/api/speeding?key=" + apiKey, {
            coordinates: coordinates
        }).done(function (response) {
            let matchedRoute = createPolyline(response.route, "#bababa");

            matchedRoute.addTo(matchedRouteLayer);

            let bounds = matchedRoute.getBounds();
            map.fitBounds(bounds);
        });
    }
}