


/**
	Utility For Initializing The Google Map
*/
function initMap () {
	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 37.3505139, lng: -121.9963086},
	    zoom: 11
	  });
}