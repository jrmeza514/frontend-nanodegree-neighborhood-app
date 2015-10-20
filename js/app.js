/*
	Run Anonymous Function To Prevent Anything From
	Spreading To The Global Scope.
*/
(function() {
    /*
    	Constructor for the PlaceOfInterest Object
    */
    var PlaceOfInterest = function(name, location, hashTag) {
        this.name = name;
        this.location = location;
        this.hashTag = hashTag;
        this.images = ko.observableArray();
        this.setSelected = function() {
            SelectedPlace(this);
        };
        this.marker = null;
    };
    /*
    	Contains the list of all the data for every location
    	without any filtering
    */
    places = [
        new PlaceOfInterest(
            "Udacity", {
                lat: 37.3998641,
                lng: -122.1105883
            },
            "udacity"
        ),
        new PlaceOfInterest(
            "West Valley College", {
                lat: 37.2654921,
                lng: -122.0111089
            },
            "westvalleycollege"
        ),
        new PlaceOfInterest(
            "Oakridge Mall", {
                lat: 37.251971,
                lng: -121.863151
            },
            "oakridgemall"
        ),
        new PlaceOfInterest(
            "San Jose Flea Market", {
                lat: 37.3685401,
                lng: -121.8772978
            },
            "fleamarket"
        ),
        new PlaceOfInterest(
            "San Jose State University", {
                lat: 37.3351874,
                lng: -121.8810715,
            },
            "sanjosestateuniversity"
        ),
        new PlaceOfInterest(
            "Great America", {
                lat: 37.398011,
                lng: -121.9745197
            },
            "greatamerica"
        ),
        new PlaceOfInterest(
            "San Jose International Airport", {
                lat: 37.3639472,
                lng: -121.9289375
            },
            "sanjoseairport"
        ),
        new PlaceOfInterest(
            "San Jose Museum of Art", {
                lat: 37.3336817,
                lng: -121.8922103
            },
            "sanjosemuseumofart"
        ),
        new PlaceOfInterest(
            "K1 Speed", {
                lat: 37.372329,
                lng: -121.979629
            },
            "k1speed"
        ),
        new PlaceOfInterest(
            "Happy Hollow Zoo and Park", {
                lat: 37.3256983,
                lng: -121.8629139
            },
            "happyhollowzoo"
        )



    ];
    // Object for the Seleted Place
    SelectedPlace = ko.observable();

    var subscription = SelectedPlace.subscribe(function() {
        // Iterate To All Markers
        $.each(markers, function(index, mk) {
            // Set Marker Icon to default
            mk.setIcon(null);
        });
        // Clos The InfoWindow If It is Open
        infowindow.close();
        // Determine if There is a Selected Place
        if (SelectedPlace() !== null) {
            // Set The InfoWindow Content to
            // The Title of the Selected Place
            infowindow.setContent(SelectedPlace().marker.title);
            // Open The Window
            infowindow.open(map, SelectedPlace().marker);
            // Pan To The Selected Marker
            map.panTo(SelectedPlace().location);
            // Show The Details panel
            $("#detail-panel").removeClass("invisible");
            // Set The Custom Icon For The Marker of the Selected Place
            SelectedPlace().marker.setIcon("http://s7.postimage.org/wg6bu3jpj/pointer.png");
        }
    });
    /*
    	Model for the UI Place List which Contains the
    	list of all the Places that are relevant to the
    	current search and will be used to render
    	the places list in the DOM
    */
    PlaceList = {
        list: ko.observableArray(places)
    };
    /*
    	Will Contain The List Of All Markers for
    	the Locations on the Map
    */
    var markers = [];

    /*
    	Model for the
    */
    var SearchView = {
        id: "search-input",
        // Initialize the SearchView with an emptry String
        value: ko.observable("")
    };
    /*
    	Ensure That the SearchView Always Notifys Any
    	Subscribers about changes in value
    */
    SearchView.value.extend({
        noftify: 'always'
    });

    /*
    	Create a Subscription to the SearchView to Keep
    	Track of its value changes
    */
    var SearchViewSubscription = SearchView.value.subscribe(function() {
        /*
        	Create an empty list of results
        */
        var res = [];
        /*
        	If the Search View Value is Empty or only has Spaces
        */
        if (SearchView.value().replace(" ", "") !== "") {

            $.each(places, function(index, place) {
                /*
                	Make Sure the Current Marker is set to the map
                */
                markers[index].setMap(map);
                /*
                	If The Name of the Current PlaceOfInterest contains
                	the value for the search Add the place to the result
                	array
                */
                if (place.name.toLowerCase().indexOf(SearchView.value().toLowerCase()) > -1) {
                    res.push(place);
                }
                /*
                	Otherwise, Make sure the marker is removed from the map
                */
                else {
                    markers[index].setMap(null);
                }
            });

        }
        /*
        	If the SearchView has no data
        	Make all results available
        */
        else {
            $.each(markers, function(index, marker) {
                // Make sure all Markers are visible
                marker.setMap(map);
            });
            /*
            	Set the results array equal to the original
            	set of places
            */
            res = places;
        }
        /*
        	Set The Observable Place List Result equal to the
        	Results Array
        */
        PlaceList.list(res);
    });

    ko.applyBindings(SearchView);
    /**
    	Utility For Initializing The Google Map
    	Needs To Be Global
    */
    initMap = function() {
        /*
        	Create New InfoWindow
        */
        infowindow = new google.maps.InfoWindow({
            content: "contentString"
        });
        /*
        	Instantiate a new map object
        */
        map = new google.maps.Map(document.getElementById('map'), {
            // Set The Center Coordinates
            center: {
                lat: 37.3505139,
                lng: -121.9963086
            },
            // Set Initial Zoom
            zoom: 12
        });
        /*
        	Create a Marker for Every PlaceOfInterestItem
        	and Store is in the markers array
        */
        $.each(places, function(index, place) {
            // create new marker
            var marker = new google.maps.Marker({
                // set it's map to the map we created
                map: map,
                // set it's center based on the curren`t place
                position: {
                    lat: place.location.lat,
                    lng: place.location.lng
                },
                // Set the title to the place name
                title: place.name

            });
            place.marker = marker;
            // Make InfoWindow Appera On Click
            marker.addListener('click', function() {
                // Set The Content Of The Window
                SelectedPlace(place);
            });
            // add the marker to the marker array
            markers.push(marker);
        });
    };

    /*
		Base Url For The InstaGram API Request
		Search By HashTag
		Replace %hashTag% with your hashtag
    */
    var baseUrl = "https://api.instagram.com/v1/tags/%hashTag%/media/recent?access_token=35376971.52c688d.7841812059474470834c3b5dbbd5bfa8";

    /*
		Iterate Through All Places to Create The Api Call For Each
		Object
    */
    $.each(places, function(index, place) {
        // create url for each place
        var url = baseUrl.replace("%hashTag%", place.hashTag);
        // initiate Ajax Request
        $.ajax({
            // set the url
            url: url,
            // set the method
            type: 'GET',
            // set data type
            dataType: 'jsonp',
            // enable chache
            cache: true,
            // set success callback
            success: function(result) {
            	// Make Sure Result is valid
                if ( typeof result.data !== 'undefined' ) {
                	// create empty array of relust Images
	                var resultImages = [];
	                // Iterate through all result data objects
	                $.each( result.data, function(index, item) {
	                    // Add the current result image to
	                    // the array
	                    resultImages.push(
	                        // get the standard resolution
	                        // image url
	                        item.images.standard_resolution.url
	                    );
	                });
	                // set the places object observable
	                // to the result images array
	                place.images(resultImages);
                };
            },
            error: function( xhr, textStatus, errorThrown ){
            	//ensure that the
            	place.images([]);
            	console.log("error");
            }
        });
    });
    /*
    	Add Key Listener to the document object
    */
    $(document).keydown(function(e) {
        // if key pressed is escape and there is a selected place
        if (e.which == 27 && SelectedPlace() !== null) {
            //make the details panel invisible
            $("#detail-panel").addClass("invisible");
            //make the selected place null
            SelectedPlace(null);
        }
    });
})(); //Call The Anonymous function