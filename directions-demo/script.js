window.onload = function () {
    var apiKey = getApiKey();

    var map = L.map("map");

    var request = {
        "destination": "44.67646564865964,10.625152587890625",
        "origin": "44.65529852148082,10.880284309387207"
    };

    //call sygic directions api
    $.post('https://routing.api.sygic.com/v0/api/directions?key=' + apiKey, request).done(function (response) {
        if (response.routes.length > 0) {
            var route = response.routes[0];

            //create leaflet polyline object from api response
            var polyline = L.Polyline.fromEncoded(route.route, {
                color: 'blue',
                weight: 3,
                smoothFactor: 1
            });
            var coords = polyline.getLatLngs();

            var startMarker = L.marker(coords[0], { title: "Start" });
            var endMarker = L.marker(coords[coords.length - 1], { title: "End" });
            L.layerGroup([polyline, startMarker, endMarker]).addTo(map);

            var bounds = new L.LatLngBounds(coords);
            map.fitBounds(bounds);
        } else {
            alert("NO_RESULTS");
        }
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);
}