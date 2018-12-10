window.onload = function () {
    var apiKey = getApiKey();

    //initialization of sygic maps
    var map = L.map("map");
    map.setView([48.146864, 17.105868], 13);
    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var exampleInput = {
        coordinates: ["43.73756,7.42216", "43.73745,7.42170", "43.73737,7.42148", "43.73728,7.42127", "43.73713,7.42091", "43.73703,7.42067", "43.73693,7.42047", "43.73678,7.42025", "43.73669,7.42012", "43.73667,7.42009", "43.73650,7.41990", "43.73632,7.41970", "43.73618,7.41955", "43.73599,7.41933", "43.73583,7.41915", "43.73571,7.41900", "43.73545,7.41868", "43.73536,7.41859", "43.73528,7.41851", "43.73509,7.41834", "43.73485,7.41824", "43.73444,7.41820", "43.73395,7.41854", "43.73364,7.41859", "43.73378,7.41857", "43.73345,7.41869", "43.73322,7.41871", "43.73282,7.41886", "43.73261,7.41852", "43.73280,7.41786", "43.73272,7.41812", "43.73289,7.41747", "43.73308,7.41737", "43.73327,7.41751", "43.73352,7.41760", "43.73378,7.41753", "43.73409,7.41742", "43.73425,7.41721", "43.73405,7.41724", "43.73451,7.41710", "43.73461,7.41709", "43.73487,7.41709", "43.73494,7.41709", "43.73537,7.41732", "43.73560,7.41752", "43.73582,7.41775", "43.73598,7.41806", "43.73610,7.41849", "43.73626,7.41881", "43.73642,7.41902", "43.73664,7.41932", "43.73678,7.41963", "43.73703,7.41982", "43.73690,7.41947", "43.73684,7.41938", "43.73676,7.41927", "43.73666,7.41916", "43.73661,7.41900", "43.73658,7.41889", "43.73655,7.41876", "43.73645,7.41855", "43.73636,7.41836", "43.73632,7.41820", "43.73625,7.41796", "43.73627,7.41776", "43.73625,7.41752", "43.73601,7.41739", "43.73582,7.41707", "43.73586,7.41668", "43.73565,7.41663", "43.73542,7.41650", "43.73530,7.41644", "43.73516,7.41637", "43.73491,7.41630", "43.73475,7.41627", "43.73446,7.41623", "43.73431,7.41619", "43.73402,7.41608", "43.73376,7.41585", "43.73361,7.41568", "43.73347,7.41550", "43.73330,7.41531"],
        accuracies: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    };

    var bounds = new L.LatLngBounds();
    var markers = L.layerGroup();
    map.addLayer(markers);

    exampleInput.coordinates.forEach(function (coordinate, index) {
        var latlng = coordsFromString(coordinate);
        addMarker(latlng, index + 1);
        bounds.extend(latlng);
    });

    map.fitBounds(bounds);

    function coordsFromString(latlngStr) {
        let split = latlngStr.split(',');
        return { lat: Number.parseFloat(split[0]), lng: Number.parseFloat(split[1]) };
    }

    function addMarker(coords, forceIndex) {
        let marker = L.marker(coords, {
            icon: new L.NumberedDivIcon({ number: forceIndex }),
            draggable: true,
            originalCoordinates: coords
        });

        marker.addTo(markers);
    }

    var createPolyline = function (line, color) {
        var polyline = L.Polyline.fromEncoded(line, {
            color: color,
            weight: 5,
            smoothFactor: 1
        });
        return polyline;
    }

    $.ajax({
        url: "https://analytics.api.sygic.com/v1/api/matching?key=" + apiKey,
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(exampleInput)
    }).done(function (response) {
        var matchedRoute = createPolyline(response.route, "red");

        map.addLayer(matchedRoute);
        var bounds = matchedRoute.getBounds();
        map.fitBounds(bounds);
    });
}