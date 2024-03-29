window.onload = function () {
    var apiKey = getApiKey();

    var optimizationUrl = "https://optimization.api.sygic.com/v0/api/optimization?key=" + apiKey;
    var routingUrl = "https://directions.api.sygic.com/v0/api/directions?key=" + apiKey;

    var map = L.map("map");

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    //we start in one depot, want to deliver to different locations and then finish in another depot
    var problemDescription = {
        startDepot: "48.21287,17.17401", //we start and end in same location
        endDepot: "48.208310, 17.187978",
        waypointsToBeOptimized: ["48.14713,17.08430", "48.15349,17.08556", "48.14932,17.21944", "48.16555,17.13828", "48.15032,17.15797"]
    }

    var optimizationApiInput = {
        locations: [
            {
                location_id: "start",
                coordinates: problemDescription.startDepot
            },
            {
                location_id: "waypoint-0",
                coordinates: problemDescription.waypointsToBeOptimized[0]
            },
            {
                location_id: "waypoint-1",
                coordinates: problemDescription.waypointsToBeOptimized[1]
            },
            {
                location_id: "waypoint-2",
                coordinates: problemDescription.waypointsToBeOptimized[2]
            },
            {
                location_id: "waypoint-3",
                coordinates: problemDescription.waypointsToBeOptimized[3]
            },
            {
                location_id: "waypoint-4",
                coordinates: problemDescription.waypointsToBeOptimized[4]
            },
            {
                location_id: "end",
                coordinates: problemDescription.endDepot
            }
        ],
        tasks: [
            {
                task_id: "task-to-waypoint-0",
                priority: "critical", //we don't want to skip this at any cost
                activities: [
                    {
                        activity_type: "Visit",
                        location_id: "waypoint-0"
                    }
                ]
            },
            {
                task_id: "task-to-waypoint-1",
                priority: "critical",
                activities: [
                    {
                        activity_type: "Visit",
                        location_id: "waypoint-1"
                    }
                ]
            },
            {
                task_id: "task-to-waypoint-2",
                priority: "critical",
                activities: [
                    {
                        activity_type: "Visit",
                        location_id: "waypoint-2"
                    }
                ]
            },
            {
                task_id: "task-to-waypoint-3",
                priority: "critical",
                activities: [
                    {
                        activity_type: "Visit",
                        location_id: "waypoint-3"
                    }
                ]
            },
            {
                task_id: "task-to-waypoint-4",
                priority: "critical",
                activities: [
                    {
                        activity_type: "Visit",
                        location_id: "waypoint-4"
                    }
                ]
            }
        ],
        vehicles: [
            {
                vehicle_id: "vehicle",
                profile: "Car",
                start_location_id: "start",
                end_location_id: "end"
            }
        ]
    }


    if (apiKey) {
        optimize(optimizationApiInput);
    }

    // post request for optimization
    function optimize(data) {
        $.ajax({
            type: 'POST',
            url: optimizationUrl,
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
        }).done(function (data, textStatus, xhr) {
            // get url for result of optimization
            var location = xhr.getResponseHeader("location");
            getResults(location);
        }).fail(function (data, textStatus, xhr) {
            alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
        });
    };

    // get result of optimization
    function getResults(url) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
        }).done(function (data, textStatus, xhr) {
            // check state of optimization process 
            if (isWaitingForResults(data.state)) {
                setTimeout(function () { getResults(url); }, 1000);
            } else {
                displayOptimizationResults(data);
            }
        }).fail(function (data, textStatus, xhr) {
            alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
        });
    };

    function isWaitingForResults(state) {
        return state === "Waiting" || state === "Running";
    }

    // process results of optimization, display data on map
    function displayOptimizationResults(data) {
        var bounds = L.latLngBounds();
        var locations = {};

        if (data.state === "Failed") {
            alert("FAILED!\r\n" + JSON.stringify(data, null, 2))
        } else {

            // create assoc. array of locations by ids for marker creation 
            data.locations.forEach(function (l) {
                locations[l.location_id] = l.coordinates.split(',');
            });

            // parse plans of tour
            data.plan.forEach(function (plan, vehicleIndex) {

                var markerLayer = L.layerGroup();

                var originCoordinates = locations[plan.activities[0].location_id];
                var destinationCoordinates = locations[plan.activities[plan.activities.length - 1].location_id];
                var waypointsCoordinates = [];

                // parse activities from current plan
                plan.activities.forEach(function (activity, activityIndex) {
                    var coordinates = locations[activity.location_id];
                    console.log(activity.location_id)
                    bounds.extend(coordinates);

                    if (activityIndex === 0 || activityIndex === plan.activities.length - 1) {
                        var origin = createMarker(coordinates, "black", "DEPOT " + activity.location_id);
                        markerLayer.addLayer(origin);
                    } else {
                        var point = createMarker(coordinates, "blue", "visit #" + activityIndex + "</br>" + activity.location_id);
                        waypointsCoordinates.push(coordinates.join(','));
                        markerLayer.addLayer(point);
                    }
                });

                markerLayer.addTo(map);

                var routingApiInputData = {
                    origin: originCoordinates.join(','),
                    destination: destinationCoordinates.join(','),
                    waypoints: waypointsCoordinates.join('|')
                }

                getRoute(routingApiInputData);
            });

            // fit map to all markers
            map.fitBounds(bounds);
        }

        function getRoute(data) {
            $.ajax({
                type: "POST",
                url: routingUrl,
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(data),
            }).done(function (data, textStatus, xhr) {
                parseRoutingResponse(data);
            }).fail(function (data, textStatus, xhr) {
                alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
            });
        }

        function createMarker(coordinates, color, index) {
            var icon = new L.NumberedDivIcon({ number: index, iconUrl: 'https://cdn.jsdelivr.net/gh/Sygic/sygic.github.io@master/img/marker-icon-' + color + '.png', });
            var marker = new L.marker(coordinates, {
                icon: icon
            });
            return marker;
        }

        // parse routing response and show route on map
        function parseRoutingResponse(data) {
            var encodedPolylineString = data.routes[0].route;
            if (typeof (encodedPolylineString) === 'undefined') return;
            var polyline = L.Polyline.fromEncoded(encodedPolylineString, {
                color: "red",
                weight: 3,
                smoothFactor: 1
            });

            polyline.addTo(map);
        }
    }
}