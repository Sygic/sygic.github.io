window.onload = function () {
    var apiKey = getApiKey();

    var lat = 48.224158;
    var lon = 16.988369;

    var map = L.map("map", {
        center: [lat, lon],
        zoom: 15
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var markers = [];
    var originalLocationMarker = L.marker([lat, lon]);
    originalLocationMarker.bindPopup('Requested location - ' + lat + ',' + lon, {autoClose: false});
    markers.push(originalLocationMarker);

    $.get('https://geocoding.api.sygic.com/v1/api/reversegeocode?location=' + lat + ',' + lon + '&key=' + apiKey).done(function (response) {
        if (response.results.length > 0) {

            var results = response.results.filter(result => {
                return result.type === "address"
            })

            if (results.length == 0) {
                results = response.results.filter(result => {
                    return result.type === "road"
                });
                if (results.length == 0) {
                    results = response.results.filter(result => {
                        return result.type === "locality"
                    });
                }
            }

            results.forEach(function(element){
                var locationLat = element.location.lat;
                var locationLon = element.location.lon;
                var formattedResult = element.formatted_result;
                var locationMarker;

                if(element.type === "road"){
                    locationMarker = createDonutMarker(locationLat, locationLon, formattedResult);
                }
                else{
                    locationMarker = L.marker([locationLat, locationLon])
                    locationMarker.bindPopup(formattedResult, {autoClose: false});
                }

                markers.push(locationMarker);
            });

            var group = L.featureGroup(markers).addTo(map);

            var bounds = group.getBounds();
            map.fitBounds(bounds);

            group.eachLayer(function (layer) {
                layer.openPopup();
            });
        } else {
            alert("NO_RESULTS");
        }
    });
}

function createDonutMarker(lat, lon, description) {
    var options = {
        borderColor: "#1e88e5",
        iconShape: 'doughnut',
        iconSize: [8, 8],
        iconAnchor: [7, 5],
        borderWidth: 2,
    };
    var marker = new L.marker([lat, lon], {icon: L.BeautifyIcon.icon(options)});
    marker.bindPopup(description, {autoClose: false});

    return marker;
}