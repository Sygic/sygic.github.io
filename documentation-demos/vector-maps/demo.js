window.onload = function() {
    var apiKey = getApiKey();
    var map = new mapboxgl.Map({
        container: 'map',                  
        style: 'https://maps.api.sygic.com/vstyle/' + apiKey,
        center: [17.12, 48.14],
        zoom: 13,
        minZoom: 4,
        hash: true
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new ZoomIndicatorControl(), 'top-left');	
}