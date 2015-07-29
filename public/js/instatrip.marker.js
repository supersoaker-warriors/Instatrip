// Custom overlay creator to replace markers
angular.module('instatrip.services')
.factory('CustomOverlay', function() {
  console.log("initialized custom overlay!");
  //if we want to change base icon size, we can do it here
  var size = "50px";
  function CustomMarker(map, instaObj, index) {
    this.index = index;
    //The 'instaObj' argument is like the currentImage
    //{
    //   $$hashkey: "string",
    //   link: "instapageurl",
    //   location: {id: int,
    //              latitude: int,
    //              longitude: int,
    //              name: "CityString"},
    //   url: "sourceurl"
    //}
    //
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
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    div.style.margin = '0 auto';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.instaObj.url;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    img.style.left = '0px';
    div.appendChild(img);

    this.div = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
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
    div.style.left = point.x + 'px';
    div.style.top = point.y + 'px';
    div.style.width =  size;
    div.style.height = size;
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