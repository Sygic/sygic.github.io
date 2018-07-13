window.onload = function () {
    var apiKey = getApiKey();

    var lat = 48.224158;
    var lon = 16.988369;

    var map = L.map("map", {
        center: [lat, lon],
        zoom: 15
    });

    var markers = [];
    var originalLocationMarker = L.marker([lat, lon]);
    originalLocationMarker.bindPopup('Requested location - ' + lat + ',' + lon, {autoClose:false});
    markers.push(originalLocationMarker);

    $.get('https://geocoding.api.sygic.com/v1/api/reversegeocode?location=' + lat + ',' + lon + '&key=' + apiKey).done(function (response) {
        if (response.results.length > 0) {

            var length = response.results.length;
            var results = {};

            // get results from response
            for (var i = 0; i < length; i++) {
                var result = response.results[i];

                results[result.type] = result;
            }

            // determine which results were returned
            if (results.hasOwnProperty('address')) {
                var address = results.address;
                var addressLat = address.location.lat;
                var addressLon = address.location.lon;
                var addressMarker = L.marker([addressLat, addressLon]);
                var formattedResult = address.formatted_result;

                addressMarker.bindPopup(formattedResult, {autoClose:false});

                markers.push(addressMarker);
            }
            else if(results.hasOwnProperty('road')){
                // closest point on road to requested location
                var road = results.road;
                var roadLat = road.location.lat;
                var roadLon = road.location.lon;
                var icon = L.icon({});
                var formattedResult = road.formatted_result;
                var roadMarker = createDonutMarker(roadLat, roadLon, formattedResult);

                roadMarker.bindPopup(formattedResult, {autoClose:false});
                markers.push(roadMarker);
            }
            else if(results.hasOwnProperty('locality')){
                var locality = results.locality;
                var localityLat = locality.location.lat;
                var localityLon = locality.location.lon;
                var localityMarker = L.marker([localityLat, localityLon]);
                var formattedResult = locality.formatted_result;

                localityMarker.bindPopup(formattedResult, {autoClose:false});

                markers.push(localityMarker);
            }

            var group = L.featureGroup(markers).addTo(map);

            var bounds = group.getBounds();
            map.fitBounds(bounds);

            group.eachLayer(function(layer){
                layer.openPopup();
            });
        } else {
            alert("NO_RESULTS");
        }
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);
}

function createDonutMarker(lat, lon, description) {
    var options = {
        borderColor: "#1e88e5",
        iconShape: 'doughnut',
        iconSize: [8,8],
        iconAnchor: [7,5],
        borderWidth: 2,
    };
    var marker = new L.marker([lat,lon], { icon: L.BeautifyIcon.icon(options) });
    marker.bindPopup(description, { autoClose:false });

    return marker;
}