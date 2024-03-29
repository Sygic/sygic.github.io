window.onload = function () {


    var apiKey = getApiKey();

    var map = L.map("map");

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    let polylineLayer = L.layerGroup();
    L.layerGroup([sygicTileLayer, polylineLayer]).addTo(map);

    const visualizePolylines = (data, layer) => {
        let lines = data.split('\n');
        lines.forEach((lineString, lineIndex) => {
            let lineSplit = lineString.split('\t');
            let line = lineSplit[0];
            let jamfactor = lineSplit[1].trim();
            let color = 'green';
            if (jamfactor === 'Light')
                color = 'orange'
            if (jamfactor === 'Hard')
                color = 'red';

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
        polyline.on('mouseover', function (e) {
            let line = e.target;
            line.setStyle({
                opacity: 0.5
            })
        })

        polyline.on('mouseout', function (e) {
            let line = e.target;
            line.setStyle({
                opacity: 1
            })
        })
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


    map.setView([28.62410908712632, 77.22546224321881], 13);
}