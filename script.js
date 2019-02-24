const populteMap = import('populateMap');

let numberBars = 0;
let numberPrice = 0;
let numberMiles = 0;

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
    console.log('My Location:');
    console.log(myLocation);

    var corsProxy = 'https://cors-anywhere.herokuapp.com/';

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": corsProxy + "https://api.yelp.com/v3/businesses/search?term=bar&latitude=" + myLocation.latitude + "&longitude=" + myLocation.longitude + "&radius=1600",
        "method": "GET",
        "headers": {
            "Authorization": "Bearer Mj1pOfDjKL_Xjyw2-WwFOV6Kjs_fkwRCQ-XOuWjwfeh-9ohYhvL_EcAwrhr7-2JdMkn2lls0uXxdozD-oWcMz2PjqNcP9c3zLQVUtxIvBRrr_nzPR7x1DsdTPMHjW3Yx",
            "cache-control": "no-cache",
            "Postman-Token": "7bd06150-b5db-4b20-9bba-b9bde2c375be"
        }
    }

    $.ajax(settings).done(function (response) {
        sortBars(response, numberBars, numberPrice, numberMiles);
    });
}

const barRange = document.getElementById('barRange');
const priceRange = document.getElementById('priceRange');
const walkRange = document.getElementById('walkRange');

noUiSlider.create(barRange, {
    start: [6],
    step: 1,
    range: {
        'min': [2],
        'max': [10]
    },
    behaviour: 'tap',
    pips: {
        mode: 'count',
        values: 5
    }
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

noUiSlider.create(walkRange, {
    start: [1.25],
    step: .1,
    range: {
        'min': [.5],
        'max': [2]
    },
    behaviour: 'tap',
    pips: {
        mode: 'range',
        density: 3
    }
});

var nonLinearSliderValueElement = document.getElementById('barRangeValue');
// var nonLinearSliderValueElement = document.getElementById('priceRangeValue');

// Show the value for the *last* moved handle.
barRange.noUiSlider.on('update', function (values, handle) {
    $('#numberBars').html(Math.round(values));
    numberBars = Math.round(values);
    let message = '';
    
    if (numberBars <= 3) {
        message = 'Eh, you can drive';
    } else if ((numberBars >= 7)) {
        message = 'Take an UBER';
    } else {
        message = 'Set TESLA to AutoPilot';
    }
    $('#barMessage').html(message);
});

priceRange.noUiSlider.on('update', function (values, handle) {
    numberPrice = Math.round(values);
});


walkRange.noUiSlider.on('update', function (values, handle) {
    $('#numberMiles').html(values);
    numberMiles = values;
});

const sortBars = (response, numberBars, numberPrice, numberMiles) => {
    let results = [];
    // const barRange = barRange.noUiSlider.get()
    // console.log(barRange);

    // Number of Bars to Return
    console.log(numberBars);
    // Price Range (1 = low | 3 = high);
    console.log(numberPrice);
    // Mile Range
    console.log(numberMiles);


    for (let i = 0; i < response.businesses.length; i++) {
        // console.log(response.businesses[i].name);
        let price = 0;

        if (response.businesses[i].price != undefined) {
            price = (response.businesses[i].price).length;
        } else {
            price = 1;
        }
        let open;
        if (response.businesses[i].is_closed) {
            open = false;
        } else {
            open = true;
        }

        const result = {
            name: response.businesses[i].name,
            price: price,
            location: {
                latitude: response.businesses[i].coordinates.latitude,
                longitude: response.businesses[i].coordinates.longitude
            },
            imageurl: response.businesses[i].image_url,
            url: response.businesses[i].url,
            rating: response.businesses[i].rating,
            open: open
        }
        results.push(result);
    }

    if (numberPrice < 2) {
        // Price Low to High
        results.sort((a, b) => {
            if (a.price < b.price) {
                return -1
            } else {
                return 1
            }
        });
    } else if (numberPrice > 2) {
        // Price High to Low
        results.sort((a, b) => {
            if (a.price > b.price) {
                return -1
            } else {
                return 1
            }
        });
    }

    results.splice(numberBars, (results.length - numberBars));

    console.log(results);

    populteMap();



}