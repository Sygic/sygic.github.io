
window.onload = function () {
    var apiKey = getApiKey();

    var map = L.map("map");

    let visualizationLayers = [];

    const clearMap = () => {
        visualizationLayers.forEach(function (layer) {
            map.removeLayer(layer);
        });
    }

    L.Map.prototype.addDropdown = function(obj, id, 
        onchange = () =>{}, 
        onkeyup = () =>{},     
        isSelected = () =>{}) {
    
        let createOption = (key, value) => {
            let opt = L.DomUtil.create('option');
            opt.setAttribute("value", `${value}`);
            if (isSelected(key, value)){
                opt.setAttribute("selected", "selected");
            }
            opt.innerHTML = key;
            return opt;
        };
    
        let dropdown = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function (map) {
                let container = L.DomUtil.create('select');
                container.id = id;
    
                if (Array.isArray(obj)) {
                    obj.forEach(element => {
                        container.appendChild(createOption(element.key, element.value));
                    });
                } else {
                    $.each(obj, (key, value) => container.appendChild(createOption(key, value)));
                }
    
                L.DomEvent.disableClickPropagation(container);
                container.onchange = onchange;
                container.onkeyup = onkeyup;
    
                return container;
            }
        });
        let control = new dropdown();
        this.addControl(control);
        $('#'+id).focus()
        return control;
    }

    let dropdownObj = {};

    fetch('results.txt')
    .then(response => response.text())
    .then((data) => {
        const lines = data.split('\n');

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const linesplit = line.split('\t');
            dropdownObj[linesplit[0]] = index;

            if (index == 0) {
                visualizeLine(linesplit)
            }
        }

        map.addDropdown(dropdownObj, "selector-dropdown", e => {
            if (e.target.value) {
                clearMap();
                const linesplit = lines[e.target.value].split('\t');
                visualizeLine(linesplit)
            }
        });
    });


    function visualizeLine(linesplit) {
        const polyline = linesplit[1];
        $("#immediate-logs").html(`Distance ${linesplit[2]}m duration ${linesplit[3]}s`);
        const layer = createLayer(polyline.replace(/\\\\/g, '\\'), 'red');
        visualizationLayers.push(layer)
        layer.addTo(map);
    }

    function createLayer(polylineString, color) {
        var polyline = L.Polyline.fromEncoded(polylineString, {
            color: color,
            weight: 3,
            smoothFactor: 1
        });

        var coords = polyline.getLatLngs();
        var bounds = new L.LatLngBounds(coords);

        var startMarker = L.marker(coords[0], { title: "Start" });
        var endMarker = L.marker(coords[coords.length - 1], { title: "End" });

        var group = L.layerGroup([polyline, startMarker, endMarker]);

        map.fitBounds(bounds);

        return group;
    }

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);
}

