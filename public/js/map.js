function loadMap(position) {

  Maptastic.loadMap(position, 'map-container');
  var map = Maptastic.mapHash['map-container'];

  var contentString = '<div class="media">' +
    '<a class="media-left" href="#">' +
    '<img src="./images/kanye-christmas.jpg" alt="Kanye!!">' +
    '</a>' +
    '<div class="media-body">' +
    '<h4 class="media-heading">Kanye</h4>' +
    'Lots of content here.' +
    '</div>' +
    '</div>';

  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });

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


  var heatMapData = [
    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
    new google.maps.LatLng(37.782, -122.445),
    {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
    {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
    new google.maps.LatLng(37.782, -122.437),
    {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},

    {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
    {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
    new google.maps.LatLng(37.785, -122.443),
    {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
    new google.maps.LatLng(37.785, -122.439),
    {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
    {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
  ];

  google.maps.event.addListener(locationMarker, 'click', function() {
    infowindow.open(map,locationMarker);
  });

  Maptastic.createHeatmap(heatMapData, 'test');
  Maptastic.addHeatmapToMap('test', 'map-container');

  heatmap = Maptastic.heatmapHash['test'];


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

  GEO.getCurrentPos(loadMap);

  $(".search-button").on("click", search);
  $("#navbar").on("click", ".toggle-heatmap", toggleHeatmap);

}

google.maps.event.addDomListener(window, 'load', initialize);

