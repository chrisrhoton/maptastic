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

}

function initialize() {

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

  var displayInfoWindow = function(overlay) {

    var messageHash = { 
      'HC03_VC04': "Percentage employed", 
      'HC03_VC30': "Commuters using public transport (percent)", 
      'HC03_VC31': "Commuters walking to work (percent)", 
      'HC03_VC33': "Percentage working from home.", 
      'HC01_VC90': "Mean earnings" 
    }
    var contentString = "<p class='lead'>" + messageHash[overlay] + "</p>";

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

  var displayBreadcrumb = function(overlay) {

    var breadcrumbHash = { 
      'HC03_VC04': "Percentage Employed", 
      'HC03_VC30': "Commuters: Public transport", 
      'HC03_VC31': "Commuters: Walking", 
      'HC03_VC33': "Working from Home", 
      'HC01_VC90': "Mean earnings" 
    }

    var $breadcrumb = $("<li class='overlay'><a href='#'>" + breadcrumbHash[overlay] + "</a></li>");

    var $navbar = $(".bc-overlay");

    $navbar.find(".overlay").detach();
    $navbar.append($breadcrumb);

  };

  var displayOverlay = function() {

    var overlay = $(this).data("overlay");

    var heatmap = Maptastic.heatmapHash[overlay];

    if( Maptastic.currentHeatmap != null ) {
      Maptastic.currentHeatmap.setMap(null);
    }

    if( heatmap != null) {

      if( heatmap == Maptastic.currentHeatmap ) {
        Maptastic.currentHeatmap = null;
        var $navbar = $(".bc-overlay");
        $navbar.find(".overlay").detach();
        return;
      }
      Maptastic.addHeatmapToMap(overlay, 'map-container');
      displayInfoWindow(overlay);
      displayBreadcrumb(overlay);
      return;
    }
    else {

      Maptastic.createHeatmap(overlay);
      Maptastic.addHeatmapToMap(overlay, 'map-container');
      displayInfoWindow(overlay);
      displayBreadcrumb(overlay);

    }

  }

  $('#overlay-dropdown').on('click', '.overlay', displayOverlay);

};

google.maps.event.addDomListener(window, 'load', initialize);



