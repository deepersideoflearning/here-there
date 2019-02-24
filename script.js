// Declaring Global variables === BAD CODE
let numberBars = 0;
let numberPrice = 0;
let numberMiles = 0;

// Toast - To be run when user clicks send
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
    // My Location from HTTP Request
    myLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    // Logging Current Latitude/Longitude
    console.log('My Location:');
    console.log(myLocation);

    // Using a CORS Proxy
    var corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Configuration for API Call
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

    // AJAX Call to Yelp API
    $.ajax(settings).done(function (response) {
        sortBars(myLocation, response, numberBars, numberPrice, numberMiles);
    });
}

// Declaring Elements to append slider to DIV
const barRange = document.getElementById('barRange');
const priceRange = document.getElementById('priceRange');
const walkRange = document.getElementById('walkRange');

// Number of Bars (2 - 10)
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

// Pricing Range (1 - 3)
noUiSlider.create(priceRange, {
    start: [2],
    step: 1,
    range: {
        'min': [1],
        'max': [3]
    },
    behaviour: 'tap'
});

// How far are you willing to walk
noUiSlider.create(walkRange, {
    start: [1],
    step: .25,
    range: {
        'min': [.5],
        'max': [1.5]
    },
    behaviour: 'tap',
    pips: {
        mode: 'range',
        density: 3
    }
});

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

const sortBars = (myLocation, response, numberBars, numberPrice, numberMiles) => {
    let results = [];

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
                lat: response.businesses[i].coordinates.latitude,
                lng: response.businesses[i].coordinates.longitude
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
   
    // MORE JAVASCRIPT
    populateMap(myLocation, results);

}


const populateMap = (myLocation, results) => {
    $('#cardRow').html('');
    $('#map').css('display', 'block');

    initMap(myLocation, results);


    function initMap(myLocation, results) {
        console.log(results);
        console.log(myLocation);
        const center = {
            lat: myLocation.latitude,
            lng: myLocation.longitude
        }
        const location = []

        for (let i = 0; i < results.length; i++) {
            location.push(results[0].location);
        }

        console.log('location');
        console.log(location);

        // The map, centered between 
        const map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 14,
                center: center
            });

        for (let i = 0; i < location.length; i++) {
            console.log('map marker for:');
            console.log(location[i]);
            new google.maps.Marker({
                position: new google.maps.LatLng(location[i]),
                map: map
            })
        }

    }
}
