window.onload = function () {
    var mapApiKey = getApiKey();
    var originMarker, destinationMarker, polyline,  route;
    var map = L.map("map", {
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Direction from here',
            callback: setOrigin
        }, {
            text: 'Direction to here',
            callback: setDestination
        }, {
            text: 'Clear map',
            callback: clearMap
        }]
    }).setView([51.505, -0.09], 13);

    var sygicTileLayer = L.TileLayer.sygic(mapApiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    L.easyButton('fa-send-o',
        run,
        'Send route to navigation'
    ).addTo(map);

    function setOrigin(e) {
        if (originMarker != undefined){
            map.removeLayer(originMarker);
        }
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
        
        originMarker = L.marker([lat, lon], {title: "Origin"}).addTo(map);
        if(destinationMarker != undefined){
            getDirections();
        }
    }

    function setDestination(e) {
        if (destinationMarker != undefined){
            map.removeLayer(destinationMarker);
        }
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
        
        destinationMarker = L.marker([lat, lon], {title: "Destination"}).addTo(map);
        if(originMarker != undefined){
            getDirections();
        }
    }

    function clearMap() {
        map.removeLayer(originMarker);
        map.removeLayer(destinationMarker);
        map.removeLayer(polyline);
        originMarker = null;
        destinationMarker = null;
        polyline = null;
    }

    function getDirections(){
        var origin = getCoordinatesFromMarker(originMarker);
        var destination = getCoordinatesFromMarker(destinationMarker);

        $.get('https://routing.api.sygic.com/v0/api/directions?origin=' + origin + '&destination=' + destination + '&key=' + mapApiKey).done(function (response) {
            if (response.status == "OK") {
                route = response.routes[0];
                encodedPolylineString = route.route;

                polyline = L.Polyline.fromEncoded(encodedPolylineString, {
                    color: 'blue',
                    weight: 3,
                    smoothFactor: 1
                }).addTo(map);

                var coords = polyline.getLatLngs();
                var bounds = new L.LatLngBounds(coords);
                map.fitBounds(bounds);
            } else {
                alert("NO_RESULTS");
            }
        });
    }

    function getCoordinatesFromMarker(marker){
        return marker.getLatLng().lat + ',' + marker.getLatLng().lng;
    }

    function run() {
        var apiKey = prompt("Please enter ApiKey for Send route to navigation API");

        if (apiKey) {
            var sendToNaviUrl = "https://directions.api.sygic.com/v0/api/sendtonavi?key=" + apiKey;

            var tag = prompt("Please enter login or IMEI of the device in format \"login_YourLogin@email.com\" or \"id_IMEIOfDevice\"");
            if (tag) {

                var sendToNaviApiInput = {
                    message: "This route was send from demo.",
                    name: "Demo route",
                    tags: tag,
                    directions_api_parameters: {
                        origin: getCoordinatesFromMarker(originMarker),
                        destination: getCoordinatesFromMarker(destinationMarker)
                    },
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