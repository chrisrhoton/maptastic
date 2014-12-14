var GEO = (function() {

  var my = {},
      supported = 'geolocation' in navigator,
      watchID,
      options = {
                  timeout: (5 * 1000),
                  maximumAge: (1000 * 60 * 15),
                  enableHighAccuracy: true
                };

  var error = function(err) {

    console.warn('GEO Module ERROR(' + err.code + '): ' + err.message);
    
  };

  my.isSupported = function() {

    return supported;

  };

  my.getCurrentPos = function(callback) {

    if( !supported || typeof callback === undefined ) { return false; }

    navigator.geolocation.getCurrentPosition(callback, error, options);

    return true;

  };

  my.trackPos = function(callback) {

    if( !supported || typeof callback === undefined ) { return false; }

    watchID = navigator.geolocation.watchPosition(callback, error, options);

    return true;

  };

  my.cancelTrackPos = function() {

    navigator.geolocation.clearWatch(watchID);

  };

  return my;


}());