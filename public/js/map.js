function loadMap(position) {

  function updateMarker( marker, latitude, longitude, label ){
    console.log(latitude + ": " + longitude);
    marker.setPosition(
      new google.maps.LatLng(
        latitude,
        longitude
      )
    );
     
    // Update the title if it was provided.
    if (label){
     
      marker.setTitle( label );
     
    }
  }

  var latitude = position.coords.latitude,
      longitude = position.coords.longitude;

  var mapOptions = {
    center: { 
      lat: latitude, 
      lng: longitude
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoom: 12,

    mapTypeControl: false,

    scaleControl: true,
    scaleControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    },
    streetViewControl: false,
    overviewMapControl: false,

    styles: [
      {
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape.man_made",
        "stylers": [
          { "hue": "#0044ff" },
          { "lightness": -3 }
        ]
      },{
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "hue": "#0091ff" },
          { "lightness": -19 },
          { "saturation": -65 }
        ]
      },{
        "featureType": "poi.park",
        "stylers": [
          { "hue": "#00ff6f" },
          { "saturation": -51 },
          { "lightness": -18 }
        ]
      },{
        "featureType": "road.highway",
        "stylers": [
          { "lightness": 24 },
          { "hue": "#007fff" },
          { "saturation": -46 }
        ]
      },{
        "featureType": "transit.line",
        "stylers": [
          { "lightness": -17 }
        ]
      },{
      }
    ]
  };
  var map = new google.maps.Map(document.getElementById('map-container'),
      mapOptions);

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

  var locationMarker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(
        latitude,
        longitude
      ),
      title: ("Here I am!"|| "")
    });

  setTimeout( function() {

    GEO.trackPos( function( newPosition ) {
       
      // Set the new position of the existing marker.
      updateMarker(
        locationMarker,
        newPosition.coords.latitude,
        newPosition.coords.longitude,
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

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });
  heatmap.setMap(map);

  var toggleHeatmap = function() {

    if( heatmap.getMap() != null ) {
      heatmap.setMap(null);
    }
    else {
      heatmap.setMap(map);
    }

  };

  $("#navbar").on("click", ".toggle-heatmap", toggleHeatmap);

}

function initialize() {
  GEO.getCurrentPos(loadMap);
}

google.maps.event.addDomListener(window, 'load', initialize);

