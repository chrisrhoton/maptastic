var Maptastic = (function() {

  var my = {
    markerHash: {},
    mapHash: {},
    heatmapHash: {},
    dataHash: {},
    currentHeatmap: null

  };

  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoom: 12,

    mapTypeControl: true,

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
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
          { "visibility": "on" }
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

  var error = function(err) {

    console.warn('Maptastic Module ERROR(' + err.code + '): ' + err.message);
    
  };

  my.loadMap = function(position, domContainer) {

    var latitude = position.coords.latitude,
        longitude = position.coords.longitude;

    mapOptions["center"] = { lat: latitude, lng: longitude };

    var map = new google.maps.Map(document.getElementById(domContainer),
      mapOptions);

    my.mapHash[domContainer] = map;

  };

  my.createMarker = function(markerPosition, mapName, markerName) {

    var latitude = markerPosition.coords.latitude,
        longitude = markerPosition.coords.longitude;

    var locationMarker = new google.maps.Marker({
      map: my.mapHash[mapName],
      position: new google.maps.LatLng(
        latitude,
        longitude
      ),
      title: ("Here I am!"|| "")
    });

    my.markerHash[markerName] = locationMarker;        

  };

  my.updateMarker = function(newPosition, markerName, label) {
    var marker = my.markerHash[markerName],
        latitude = newPosition.coords.latitude,
        longitude = newPosition.coords.longitude;

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

  };

  my.convertPointsToHeatMap = function(key) {
    return my.dataHash[key].map(function(v, i) {
      return { location: new google.maps.LatLng(v[0], v[1]), weight: v[2] };
    });
  }

  my.createHeatmap = function(heatmapName) {

    var heatmap = new google.maps.visualization.HeatmapLayer({
                    data: my.convertPointsToHeatMap(heatmapName),
                    dissipating: true,
                    radius: 50
                  });
    my.heatmapHash[heatmapName] = heatmap;

  }

  my.addHeatmapToMap = function(heatmapName, mapName) {
    my.currentHeatmap = my.heatmapHash[heatmapName]
    my.currentHeatmap.setMap(my.mapHash[mapName]);
  };

  // my.toggleHeatmap = function(heatmapName, mapName) {

  //   var heatmap = Maptastic.heatmapHash[heatmapName];

  //   if( heatmap.getMap() != null ) {
  //     heatmap.setMap(null);
  //   }
  //   else {
  //     heatmap.setMap(Maptastic.mapHash[mapName]);
  //   }

  // };

  return my;

}());