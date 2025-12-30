$(document).ready(function(){
    // Wait for Google Maps API to be loaded before initializing
    function waitForGoogleMaps(callback, maxAttempts = 50, attempt = 0) {
        if (typeof google !== 'undefined' && google.maps) {
            callback();
        } else if (attempt < maxAttempts) {
            setTimeout(function() {
                waitForGoogleMaps(callback, maxAttempts, attempt + 1);
            }, 100);
        } else {
            console.error('Google Maps API failed to load after ' + (maxAttempts * 100) + 'ms');
        }
    }

    // Get initial lat/lng values from the form
    let lat = $('input[name="latitude"]').val();
    let lng = $('input[name="longitude"]').val();

    // Wait for Google Maps to be available before initializing
    waitForGoogleMaps(function() {
        // Check if we have valid coordinates
        if(lat && lng && lat !== '' && lng !== '' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))){
            // Convert string values to numbers and initialize map
            initMap(null, parseFloat(lat), parseFloat(lng));
        } else {
            // Default to Greece if no coordinates
            initMap('Ελλάδα');
        }
    });
})

function initMap(address1 = null, latitude = null, longitude = null) {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API is not loaded yet');
        return;
    }

    // If we have specific coordinates, use them directly
    if(latitude !== null && longitude !== null){

        var myLatLng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};

        var map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 11
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Report Location',
            draggable: true
        });

        // Update hidden fields with current coordinates
        $('input[name="latitude"]').val(myLatLng.lat.toFixed(6));
        $('input[name="longitude"]').val(myLatLng.lng.toFixed(6));

        // Handle marker drag events
        google.maps.event.addListener(marker, 'dragend', function(marker) {
            var latLng = marker.latLng.lng();
            var latLat = marker.latLng.lat();

            $('input[name="latitude"]').val(latLat.toFixed(6));
            $('input[name="longitude"]').val(latLng.toFixed(6));
        });

        return;
    }

    // If we have an address, geocode it
    if(address1 !== null){
        // Get the API key from the Google Maps script tag that's already loaded
        var apiKey = '';
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src && src.indexOf('maps.googleapis.com/maps/api/js') !== -1) {
                var match = src.match(/[?&]key=([^&]+)/);
                if (match) {
                    apiKey = match[1];
                    break;
                }
            }
        }

        fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(address1)+'&key='+apiKey)
            .then(response => response.json())
            .then(data => {
                if(data.results[0] === undefined){
                    console.error('Geocoding failed for address:', address1);
                    return false;
                }

                // Double-check that Google Maps is still available after async fetch
                if (typeof google === 'undefined' || !google.maps) {
                    console.error('Google Maps API is not available after geocoding');
                    return;
                }

                const ajaxLatitude = data.results[0].geometry.location.lat;
                const ajaxLongitude = data.results[0].geometry.location.lng;

                var myLatLng = { lat: ajaxLatitude, lng: ajaxLongitude};

                var map = new google.maps.Map(document.getElementById('map'), {
                    center: myLatLng,
                    zoom: 11
                });

                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: address1,
                    draggable: true
                });

                // Update hidden fields with geocoded coordinates
                $('input[name="latitude"]').val(myLatLng.lat.toFixed(6));
                $('input[name="longitude"]').val(myLatLng.lng.toFixed(6));

                // Handle marker drag events
                google.maps.event.addListener(marker, 'dragend', function(marker) {
                    var latLng = marker.latLng.lng();
                    var latLat = marker.latLng.lat();

                    $('input[name="latitude"]').val(latLat.toFixed(6));
                    $('input[name="longitude"]').val(latLng.toFixed(6));
                });
            })
            .catch(error => {
                console.error('Error geocoding address:', error);
            });
    }
}

window.initMap = initMap;
