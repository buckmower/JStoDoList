var map = null;
function CoordValues(lat, lng, acc) {
	this.lat = lat;
	this.lng = lng;
	this.acc = acc;
}
function showMap(lat, long) {
    
    var mapDiv = document.getElementById("map");
    var googleLatLong = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 12,
        center: googleLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapDiv, mapOptions);
    map.panTo(googleLatLong);
    return;
 
}
function addMarker(lat, long) {
	var googleLatLong = new google.maps.LatLng(lat, long);
	var markerOptions = {
	    position: googleLatLong,
	    map: map,
	    title: "Location of to do list item"
        }
        var marker = new google.maps.Marker(markerOptions);
        return;
}
function getMyLocation(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var acc = position.coords.accuracy;
    
    var coordValue = new CoordValues(lat, lng, acc);
    coordValues.push(coordValue);
    getFormData();
}
function passLocation(e) {  
    var todoHere = e.target;
    var id = todoHere.parentElement.id;
    for (var i = 0; i < todos.length; i++) {
    if (todos[i].id == id) {
    try {
    if (!todos[i].coordValues && !todos[i].coordValues) {
    	throw new Error("No coordinates available for this Item.");
    	console.log = "No coordinates available for this Item.";
    	var mapDiv = document.getElementById("map");
    	mapDiv.innHTML = "No coordinates available for this Item.";
    }
    else {
    var lat = todos[i].coordValues.lat;
    var long = todos[i].coordValues.lng;
    	showMap(lat, long);
	addMarker(lat, long);
	return;
    }
    }
    catch (ex) {
        displayError(ex.message);
    }
    }
    }
}   
function geoLocate() {
 if (navigator.geolocation) {
        var positionOptions = {
            enableHighAccuracy: false
        };
        navigator.geolocation.getCurrentPosition(getMyLocation, locationError, positionOptions);
        return;
        }
        else {
        console.log("Sorry, no Geolocation support!");
        getFormData();
        }
}
//show error if no geo coords     
function locationError(error) {
    var errorTypes = {
        0: "Unknown error",
        1: "The Map won't work without geo location enabled.",
        2: "Position not available",
        3: "Request timed out"
    };
    var errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage += " " + error.message;
    }
    console.log(errorMessage);
    alert(errorMessage);
    getFormData();
}