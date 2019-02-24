// Allow Location Toast - will chain to other function
function toast() {
    M.toast({
        html: 'Please Allow Your Location',
        displayLength: 1000,
        completeCallback: function () {
            getLocation();
        }
    });
}


// Get User Location from HTTPS
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('Geolocation Failed');
        $('demo').html('Geolocation is not supported by this browser.');
    }
}

// Temporary - Display User Location
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




const barRange = document.getElementById('barRange');
const priceRange = document.getElementById('priceRange');

noUiSlider.create(barRange, {
    start: [5],
    step: 1,
    range: {
        'min': [0],
        'max': [10]
    },
    behaviour: 'tap',
    pips: {mode: 'count', values: 5}
});

noUiSlider.create(priceRange, {
    start: [2],
    step: 1,
    range: {
        'min': [1],
        'max': [3]
    },
    behaviour: 'tap'
});

var nonLinearSliderValueElement = document.getElementById('barRangeValue');
// var nonLinearSliderValueElement = document.getElementById('priceRangeValue');

// Show the value for the *last* moved handle.
barRange.noUiSlider.on('update', function (values, handle) {
    console.log('updated: ' + values);
});