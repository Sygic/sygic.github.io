window.onload = function () {
    var apiKey = prompt("Please ender an API key valid for TomTom maps.");

    if (apiKey == null || apiKey == "") {
        location.reload();
    }

    var reverseGeocodingUrl = "https://geocoding.api.sygic.com/v1/api/batch/reversegeocode?key=" + apiKey;

    var map = L.map("map",{
        center: [51.50055501480524, -0.12676656246185306],
        zoom: 18
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);


    var resultsLayer;

    if (resultsLayer != null)
        map.removeLayer(resultsLayer);

    var request = [
        {
            lat: "51.50105925961465",
            lon: "-0.12856364250183108"
        },
        {
            lat: "51.50124960223127",
            lon: "-0.12593507766723636"
        }
    ];


    $.ajax({
        type: 'POST',
        url: reverseGeocodingUrl,
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(request),
    }).done(function (data, textStatus, xhr) {
        // get url for result of reverse geocoding
        var location = xhr.getResponseHeader("location");
        getResults(location);
    }).fail(function (data, textStatus, xhr) {
        alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
    });


    function getResults(url) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
        }).done(function (data, textStatus, xhr) {
            // check state of reverse geocoding process
            if (isWaitingForResults(data.state)) {
                setTimeout(function () {
                    getResults(url);
                }, 1000);
            } else {
                displayResults(data);
            }
        }).fail(function (data, textStatus, xhr) {
            alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
        });
    }

    function isWaitingForResults(state) {
        return state === "WAITING" || state === "RUNNING";
    }

    function displayResults(data) {
        if (data.results.length > 0) {

            var layerGroupArray = [];

            data.results.forEach(function (result, index) {
                var geocodedResult = result.filter(result => {
                    return result.type === "address"
                })

                if (geocodedResult.length > 1) {
                    geocodedResult = geocodedResult.filter(l => {
                        return l.location_type === "interpolated"
                    });
                }
                else {
                    if (geocodedResult.length == 0) {
                        geocodedResult = result.filter(result => {
                            return result.type === "road" && result.components[0].value != "(Unnamed Road)"
                        });
                        if (geocodedResult.length == 0) {
                            geocodedResult = result.filter(result => {
                                return result.type === "locality"
                            });
                        }
                    }
                }

                geocodedResult.forEach(function (element) {
                    var formattedResult = element.formatted_result;

                    var popup = L.popup()
                        .setLatLng([request[index].lat, request[index].lon])
                        .setContent(formattedResult);

                    layerGroupArray.push(popup)
                });
            });

            resultsLayer = L.featureGroup(layerGroupArray).addTo(map);

            var bounds = resultsLayer.getBounds();
            map.fitBounds(bounds);
        } else {
            alert("NO_RESULTS");
        }
    }
};


