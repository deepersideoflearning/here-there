
// Allow Location Toast - will chain to other function
function toast() {
    M.toast({
        html: 'Allow Your Location Above ^',
        displayLength: 1000,
        completeCallback: function () {
            getLocation();
        }
    });
}


// Get Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('Geolocation Failed');
        $('demo').html('Geolocation is not supported by this browser.');
    }
}

function showPosition(position) {
    const myLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    const testDiv = $('<div>');
    testDiv.html('Latitude: ' + myLocation.latitude + '<br>Longitude: ' + myLocation.longitude);
    // x.innerHTML = "Latitude: " + position.coords.latitude +
    //     "<br>Longitude: " + position.coords.longitude;

    $('#demo').append(testDiv);

}



// OnLoad - check location