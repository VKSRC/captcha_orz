$(elem).on("myevent", function() {
  $.when( loadGoogleMaps( 3, API_KEY, LANG ) )
    .then(function() {
      !!google.maps // true
    });
});

// OR 

$(elem).on("myevent", function() {
  loadGoogleMaps( 3, API_KEY, LANG )
    .done(function() {
      !!google.maps // true
    });
});
