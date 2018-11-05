window.onload = function () {
    var mapApiKey = getApiKey();
    var map = L.map("map").setView([44.67646564865964, 10.625152587890625], 13);

    var sygicTileLayer = L.TileLayer.sygic(mapApiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var request = {
        "destination": "44.67646564865964,10.625152587890625",
        "origin": "44.65529852148082,10.880284309387207"
    };

    //call sygic directions api
    $.ajax({
        url: "https://routing.api.sygic.com/v0/api/directions?key=" + mapApiKey,
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(request)
    }).done(function (response) {
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

            // Fired when the grid layer loaded all visible tiles.
            sygicTileLayer.on('load', function() {
                sendToNavigation(route);
            });

        } else {
            alert("NO_RESULTS");
        }
    });

    function sendToNavigation(route) {
        var apiKey = prompt("Please enter ApiKey for Send route to navigation API");

        if (apiKey) {
            var sendToNaviUrl = "https://directions.api.sygic.com/v0/api/sendtonavi?key=" + apiKey;

            var tag = prompt("Please enter login or IMEI of the device in format \"login_YourLogin@email.com\" or \"id_IMEIOfDevice\"");
            if (tag) {

                var sendToNaviApiInput = {
                    message: "This route was send from demo.",
                    name: "Demo route",
                    tags: tag,
                    directions_api_parameters: request,
                    directions_api_result: route
                };
                send(sendToNaviApiInput);
            }
        }

        // post request for send to navigation
        function send(data) {
            $.ajax({
                type: 'POST',
                url: sendToNaviUrl,
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(data),
            }).done(function (data, textStatus, xhr) {
                // get result of send route to navi
                alert("Status: " + textStatus)
            }).fail(function (data, textStatus, xhr) {
                alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
            });
        }
    }
}