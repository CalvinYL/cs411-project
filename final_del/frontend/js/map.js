function initMap() {
  var mugar = new google.maps.LatLng(42.350835, -71.107708);
  var gsu = new google.maps.LatLng(42.350937, -71.108526);
  var ugradLab = new google.maps.LatLng(42.349779, -71.106653);
  var warren = new google.maps.LatLng(42.349545, -71.104317);
  var towers = new google.maps.LatLng(42.350284, -71.099626);
  var myles = new google.maps.LatLng(42.349675, -71.094749);
  var sciLib = new google.maps.LatLng(42.348480, -71.101871);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: mugar,
    zoom: 15
  });

  var coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setContent(createInfoWindowContent('Mugar',mugar, map.getZoom()));
  coordInfoWindow.setPosition(mugar);
  coordInfoWindow.open(map);

  var coordInfoWindow2 = new google.maps.InfoWindow();
  coordInfoWindow2.setContent(createInfoWindowContent('GSU',gsu, map.getZoom()));
  coordInfoWindow2.setPosition(gsu);
  coordInfoWindow2.open(map);

  var coordInfoWindow3 = new google.maps.InfoWindow();
  coordInfoWindow3.setContent(createInfoWindowContent('CS ugrad Lab',ugradLab, map.getZoom()));
  coordInfoWindow3.setPosition(ugradLab);
  coordInfoWindow3.open(map);

  var coordInfoWindow4 = new google.maps.InfoWindow();
  coordInfoWindow4.setContent(createInfoWindowContent('Warren',warren, map.getZoom()));
  coordInfoWindow4.setPosition(warren);
  coordInfoWindow4.open(map);

  var coordInfoWindow5 = new google.maps.InfoWindow();
  coordInfoWindow5.setContent(createInfoWindowContent('Myles',myles, map.getZoom()));
  coordInfoWindow5.setPosition(myles);
  coordInfoWindow5.open(map);

  var coordInfoWindow6 = new google.maps.InfoWindow();
  coordInfoWindow6.setContent(createInfoWindowContent('Towers',towers, map.getZoom()));
  coordInfoWindow6.setPosition(towers);
  coordInfoWindow6.open(map);

  map.addListener('zoom_changed', function() {
    coordInfoWindow.setContent(createInfoWindowContent(mugar, map.getZoom()));
    coordInfoWindow.open(map);
  });
}

var TILE_SIZE = 256;

function createInfoWindowContent(name, latLng, zoom) {
  var scale = 1 << zoom;

  var worldCoordinate = project(latLng);

  var pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale));

  var tileCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale / TILE_SIZE),
    Math.floor(worldCoordinate.y * scale / TILE_SIZE));

  return [
  name
  ].join('<br>');
}
// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  var siny = Math.sin(latLng.lat * Math.PI / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}