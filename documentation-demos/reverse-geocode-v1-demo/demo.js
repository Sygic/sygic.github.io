var apiKey = getApiKey();
var map;
var markersGroup;

window.onload = function () {

    var lat = 48.224158;
    var lon = 16.988369;

    map = L.map("map", {
        center: [lat, lon],
        zoom: 15
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var contextMenu = L.popup();

    map.on('contextmenu',(e) => {
        contextMenu.setContent('<button onclick="whatIsHere(' + e.latlng.lat + ',' + e.latlng.lng + ')">What\'s here?</button>').setLatLng(e.latlng).openOn(map);
    });

    whatIsHere(lat,lon);
}

function whatIsHere (lat, lon) {
    var markers = [];

    if (markersGroup != null)
        map.removeLayer(markersGroup);

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

                // location type can be:
                //                 // for address result type: "exact" or "interpolated"
                //                 // for road result type: "closest point"
                //                 // for locality result type: "centroid"
                var locationType = humanize(element.location_type);

                var formattedResult = locationType + ":<br>" + element.formatted_result;
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

            markersGroup = L.featureGroup(markers).addTo(map);

            var bounds = markersGroup.getBounds();
            map.fitBounds(bounds);

            markersGroup.eachLayer(function (layer) {
                layer.openPopup();
            });
        } else {
            alert("NO_RESULTS");
        }
    });
}

function humanize(str) {
    var frags = str.split('_');
    for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
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
