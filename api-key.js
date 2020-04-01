//get apikey from URL to be used in sygic api calls
var getApiKey = function () {
    var search = window.location.search.substr(1).split("=");
    if (search[0] == "key" && search[1]) {
        return search[1];
    } else {
        var apiKey = prompt("Please enter an API key valid for Sygic maps.");
        return apiKey;
    }
}