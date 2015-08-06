// Custom overlay creator to replace markers
angular.module('instatrip.services')
.factory('CustomOverlay', function() {
  console.log("initialized custom overlay!");
  //if we want to change base icon size, we can do it here
  var size = 100;
  function CustomMarker(map, instaObj, index) {
    this.index = index;

    this.instaObj = instaObj;
    //TODO: latlng
    this.latlng = new google.maps.LatLng(this.instaObj.location.latitude ,this.instaObj.location.longitude);
    this.map = map;
    this.setMap(map);
    this.div = null;
  }
  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.onAdd = function() {

    var div = document.createElement('div');
    div.className = 'markerWrapper';

    var picWrapper = document.createElement('div');
    picWrapper.className = 'picWrapper';

    var backgroundStyler = document.createElement('div');
    backgroundStyler.className = 'backgroundStyler';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.instaObj.url;

    img.className = 'markerPic';
    picWrapper.appendChild(img);
    backgroundStyler.appendChild(picWrapper);
    div.appendChild(backgroundStyler);
    this.div = div;
    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(div);
  };
  CustomMarker.prototype.draw = function() {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var point = overlayProjection.fromLatLngToDivPixel(this.latlng);
    // Resize the image's div to fit the indicated dimensions.
    var div = this.div;
    div.style.left = point.x - (size/2) +  'px';
    div.style.top = point.y - (size*1.1) + 'px';
    div.style.width =  size + 'px';
    div.style.height = size*1.1 + 'px';
  };
  CustomMarker.prototype.onRemove = function() {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  };
  var placeMarker = function(map, instaObj, index) {
    return new CustomMarker(map, instaObj, index);
  };
  return {
    placeMarker: placeMarker
  }
})
