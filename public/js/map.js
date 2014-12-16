function loadMap(position) {

  Maptastic.loadMap(position, 'map-container');
  var map = Maptastic.mapHash['map-container'];

  Maptastic.createMarker(position, 'map-container', 'user');

  var locationMarker = Maptastic.markerHash['user'];

  setTimeout( function() {

    GEO.trackPos( function( newPosition ) {
       
      // Set the new position of the existing marker.
      Maptastic.updateMarker(
        newPosition,
        'user',
        "Updated / Accurate Position"
      );
   
    });

  }, 10000);

  Maptastic.createHeatmap('HC03_VC04');
  Maptastic.addHeatmapToMap('HC03_VC04', 'map-container');

}

function initialize() {

  var toggleHeatmap = function(heatmapName, mapName) {

    var heatmap = Maptastic.heatmapHash[heatmapName];

    if( heatmap.getMap() != null ) {
      heatmap.setMap(null);
    }
    else {
      heatmap.setMap(Maptastic.mapHash[mapName]);
    }

  };

  var search = function() {

    var address = $(".search-input").val();
    var geocoder = new google.maps.Geocoder();
    var map = Maptastic.mapHash['map-container'];

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

    $(".search-input").val("");


  };

  var searchKeyHandler = function(event) {

    if ( event.keyCode == 13 ) {
      event.preventDefault();
      search();
    }

  };

  GEO.getCurrentPos(loadMap);

  $(".search-button").on("click", search);
  $(".search-input").on("keyup", searchKeyHandler)
  $("#navbar").on("click", ".toggle-heatmap", toggleHeatmap);

  var displayAboutWindow = function() {

    console.log("Here I am!");

    var contentString = "<p class='lead'>You're viewing employment percentages.</p>";

    var map = Maptastic.mapHash['map-container'];

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        position: map.getCenter()
    });
    
    infowindow.open(map);

    setTimeout( function() {
      infowindow.close();
    }, 3000);

  }

  $('#overlay-dropdown').on('click', '.employ-overlay', displayAboutWindow);

};

google.maps.event.addDomListener(window, 'load', initialize);



