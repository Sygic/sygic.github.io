window.onload = function () {
    var apiKey = prompt("Please enter an API key valid for Sygic maps.");

    if (apiKey == null || apiKey == "") {
        return location.reload();
    }
    var map = L.map("map", {
        center: [51.500434, -0.12634],
        zoom: 15
    });

    var mapLayerUser = L.TileLayer.sygic(apiKey, {detectRetina: false});
    var sateliteLayer = L.TileLayer.sygicSatellite(apiKey, {detectRetina: false});
    var poiLayer = L.TileLayer.sygicPoi(apiKey);
    var restrictionLayer = L.TileLayer.sygicRestriction(apiKey);
    var incidentLayer = L.TileLayer.sygicIncident(apiKey);

    var trafficLayer = new L.TileLayer.sygicTraffic(apiKey, {
        trafficControl: true
    });

    var baseMaps = {'Map': mapLayerUser, 'Satelite': sateliteLayer};

    var overlayMaps = {
        'Poi': poiLayer,
        'Restriction': restrictionLayer,
        'Traffic': trafficLayer,
        'Incident': incidentLayer
    };

    L.layerGroup([mapLayerUser, poiLayer, restrictionLayer, incidentLayer, trafficLayer]).addTo(map);

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
}