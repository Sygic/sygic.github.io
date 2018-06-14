window.onload = function () {
    var apiKey = getApiKey();

    var map = L.map("map");

    var request = { 
        "origin": "44.65529852148082,10.880284309387207", 
        "destination": "44.736978954208844,10.610046386718752", 
        "toll_costs": true, 
        "toll_segments": true, 
        "vehicle_type": "truck",
        "height_at_first_axle": 300,
        "total_weight": 8000, 
        "trailers": 1, 
        "vehicle_axles": 2, 
        "trailer_axles": 1, 
        "emission_class": "euro4" 
    };

    //call sygic directions api with toll cost parameters
    $.post('https://routing.api.sygic.com/v0/api/directions?key=' + apiKey, request).done(function (response) {
        if (response.routes.length > 0) {
            var route = response.routes[0];

            //create leaflet polyline object from api response
            var polyline = L.Polyline.fromEncoded(route.route, {
                color: 'blue',
                weight: 4,
                smoothFactor: 1
            });
            var coords = polyline.getLatLngs();

            var startMarker = L.marker(coords[0], { title: "Start" });
            var endMarker = L.marker(coords[coords.length - 1], { title: "End" });

            var layerGroupArray = [polyline, startMarker, endMarker];

            if (route.toll_cost_segments){
                var length = route.toll_cost_segments.length;
                for (var i = 0; i < length; i++) {
                    var segment = route.toll_cost_segments[i];
                    if(segment && segment.cost && segment.cost > 0){
                        var encode = L.Polyline.fromEncoded(segment.geometry);
                        if(encode && encode._latlngs){
                            var polylineStyle = {
                                color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                                weight: 5,
                                smoothFactor: 1,
                                offset: -12
                            };

                            var tollCostSegmentPolyline = L.polyline(encode._latlngs, polylineStyle).addTo(map);
                            layerGroupArray.push(tollCostSegmentPolyline)

                            tollCostSegmentPolyline.on('mouseover', function(e) {
                                var latlng = e.latlng || e.target.getCenter();

                                L.popup()
                                    .setLatLng(latlng)
                                    .setContent('<small>S: ' + segment.start_road_name + '<br />' + segment.end_road_name + '<br />' + (segment.cost/1000) + segment.iso + '</small>')
                                    .openOn(map);
                            })
                            tollCostSegmentPolyline.on('mouseout', function() {
                                if(map){
                                    map.closePopup();
                                }
                            })
                        }
                    }
                }
            }

            L.layerGroup(layerGroupArray).addTo(map);

            var bounds = new L.LatLngBounds(coords);
            map.fitBounds(bounds);
        } else {
            alert("NO_RESULTS");
        }
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }