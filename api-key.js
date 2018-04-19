//get apikey from URL to be used in sygic api calls
var getApiKey = function () {
    var search = window.location.search.substr(1).split("=");
    if (search[0] == "key" && search[1]) {
        return search[1];
    } else {
        alert("You have to provide api-key in the URL ?key=YOUR_API_KEY");
    }
}