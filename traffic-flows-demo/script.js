window.onload = function () {

    var apiKey = getApiKey();

    var map = L.map("map");

    let colors = [
        "black", "red", "green",  "blue", "yellow", "orange", "pink"
    ];

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    let polylineLayer = L.layerGroup();
    L.layerGroup([sygicTileLayer, polylineLayer]).addTo(map);

    const visualizePolylines = (data, layer) => {
        let lines = data.split('\n');
        lines.forEach((line, lineIndex) => {
            let color = colors[lineIndex % colors.length]
            
            line = line.replace(/\\\\/g, '\\')
            let polyline = createPolyline(line, color);
            polyline.addTo(layer);
        });
        layer.addTo(map);
    }

    const createPolyline = (line, color) => {
        let polyline = L.Polyline.fromEncoded(line, {
            color: color,
            weight: 5,
            smoothFactor: 1
        });
        return polyline;
    }

    fetch('raw-flows.js').then(response => response.text())
    .then((data) => {
        if (data) {
            visualizePolylines(data, polylineLayer);
        } else {
            polylineLayer.clearLayers();
        }
    });


    map.setView([28.65640,77.18230], 14);
}