window.onload = function () {
    var apiKey = prompt("Please ender an API key valid for TomTom maps.");

    if (apiKey == null || apiKey == "") {
        return location.reload();
    }

    var map;
    var popup;

    var lat = 51.50105925961465;
    var lon = -0.12856364250183108;

    map = L.map("map", {
        center: [lat, lon],
        zoom: 18
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var contextMenu = L.popup();

    map.on('contextmenu',(e) => {
        contextMenu.setContent('<a href onclick="whatIsHere(' + e.latlng.lat + ',' + e.latlng.lng + '); return false;">What\'s here?</a>').setLatLng(e.latlng).openOn(map);
    });

    function whatIsHere (lat, lon) {

        if (popup != null)
            map.removeLayer(popup);

        $.get('https://geocoding.api.sygic.com/v1/api/reversegeocode?location=' + lat + ',' + lon + '&key=' + apiKey).done(function (response) {
            if (response.results.length > 0) {

                var results = response.results.filter(result => {
                    return result.type === "address"
                })

                if(results.length > 1){
                    results = results.filter(l => {
                        return l.location_type === "interpolated"
                    });
                }
                else {
                    if (results.length == 0) {
                        results = response.results.filter(result => {
                            return result.type === "road" && result.components[0].value != "(Unnamed Road)"
                        });
                        if (results.length == 0) {
                            results = response.results.filter(result => {
                                return result.type === "locality"
                            });
                        }
                    }
                }

                results.forEach(function(element){
                    var formattedResult =  element.formatted_result;

                    popup = L.popup()
                        .setLatLng([lat,lon])
                        .setContent(formattedResult)
                        .openOn(map);
                });
            } else {
                alert("NO_RESULTS");
            }
        });
    }

    whatIsHere(lat,lon);
}
