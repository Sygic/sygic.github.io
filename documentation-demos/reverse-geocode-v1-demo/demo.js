var apiKey = getApiKey();
var map;
var popup;

window.onload = function () {

    var lat = 48.224158;
    var lon = 16.988369;

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

    whatIsHere(lat,lon);
}

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