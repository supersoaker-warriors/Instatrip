angular.module('instatrip.services', [])

.factory('Getdata', function ($http, $state, CustomOverlay) {
  var currentImages = [];
  var currentCoords = [];
  var Map;
  var markers = [];
  var currentMarker;
  var points = 15;
  var getmap = function(start,end,travelMethod){
    travelMethod = travelMethod || 'DRIVING';
    start = start || 'San Francisco';
    end = end || 'Oakland';
    var trvmthd = travelMethod;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    var MY_MAPTYPE_ID = 'custom_style';
    function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer();
      var MakerSquare = new google.maps.LatLng(37.787518, -122.399868);
      var mapOptions = {
        zoom:7,
        center: MakerSquare,
        disableDefaultUI: true,
        zoomControl: true,
           zoomControlOptions: {
             style: google.maps.ZoomControlStyle.SMALL
           },
        mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
        },
        mapTypeId: MY_MAPTYPE_ID
      };

      var featureOpts = [
        {
          stylers: [
            { hue: '#f8b5ad' },
            { visibility: 'simplified' },
            { gamma: 0.7 },
            { weight: 0.5 }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            { color: '#f8b5ad' }
          ],
        },
        {
          elementType: 'labels',
          stylers: [
            { visibility: 'off' }
          ]
        },
        {
          featureType: 'water',
          stylers: [
            { color: '#6d6e72' },
            { gamma: 0.8 },
            { weight: 0.8 }
          ]
        },
        {
          featureType: 'water',
          elementType: 'labels,text.stroke',
          stylers: [
            { color: '#6d6e72' },
            { gamma: 0.4 },
            { weight: 0.6 }
          ]
        }
      ];
      var styledMapOptions = {
        name: 'custom style'
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
      map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
      directionsDisplay.setMap(map);
      Map = map;
    }

    function calcRoute(start, end, travelMethod, callback) {
      var travelMethod = travelMethod || 'DRIVING';
      var waypoints = []; // these will be waypoints along the way
      var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode[travelMethod],
          unitSystem: google.maps.UnitSystem.IMPERIAL,
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      var nPts = findN(response.routes[0].overview_path, points);
      var coords = [];
      console.log("Welcome to Team SuperSoaker's InstaTrip!")
      for(var i = 0; i < nPts.length; i++){
        coords.push({
          lat: nPts[i].G,
          lng: nPts[i].K
        });
      }
        currentCoords = coords;

        callback(response.routes[0].overview_path, coords);
      });
    }

    initialize();
    var routes = calcRoute(start, end, travelMethod, ourCallback);

// take variable length array and return an array with n evenly spaced points
    var findN = function(input, n){
        var len = input.length;
        var divis;
        var output = [];
        if (len > n){
            divis = Math.floor(len / n);
        } else {
            divis = n;
        }

        for(var i = 0; i < len; i+=divis){
            output.push(input[i]);
        }
        return output;
    };


    function ourCallback(routes, coords){
      return getPhoto({
        coords: coords
      });
    };

  };

  var markMap = function(num) {
    // collect all of the coords/create require objects and put them into markers array
    var curlen = markers.length;
    if (curlen > 0){
      for (var i = 0; i < curlen; i++){
          markers[i].setMap(null);
      }
    }
        markers = [];
    for (var j = 0; j < currentCoords.length; j++){
        /*
        //var myLatlng = new google.maps.LatLng(currentCoords[j].lat ,currentCoords[j].lng);
        var myLatlng = new google.maps.LatLng(currentImages[j].location.latitude ,currentImages[j].location.longitude);
        var curImg = {
          url: currentImages[j].url,
          // This marker is 20 pixels wide by 32 pixels tall.
          scaledSize: new google.maps.Size(50, 50)
          // The origin for this image is 0,0.
          //origin: new google.maps.Point(0,0),
          // The anchor for this image is the base of the flagpole at 0,32.
          //anchor: new google.maps.Point(0, 32)
        };
        var marker = new google.maps.Marker({
            position: myLatlng,
            icon: curImg
         });
        markers.push(marker);
        */
        var newMarker = CustomOverlay.placeMarker(Map, currentImages[j], j);
        markers.push(newMarker);
    }
    // remove all of the markers expect the one need to be marked
    // To add or remove the marker to the map, call setMap();
    for (j = 0; j < currentCoords.length; j++){
        if (j === num) {
          if (currentMarker !== num){
            currentMarker = num;
            markers[j].setMap(Map);
          }
        } else {
          markers[j].setMap(null);
        }

    }
  };

  // Initiate Instagram request and package response into display
  var getPhoto = function(routes){
    var imgHolder = [];
    var linkHolder = {};
    return $http({
      method: 'POST',
      url: "/search",
      data: routes

    }).then(function(resp){
      var respLength = resp.data.length;
      for(var i = 0; i < respLength; i++){
        for (var j = 0; j < resp.data[i].length; j++){
          if (!(resp.data[i][j].link in linkHolder)){
            linkHolder[resp.data[i][j].link] = resp.data[i][j];
            imgHolder.push(resp.data[i][j]);
            break;
          }
        }
      }
      currentImages = imgHolder;
      $state.go('display.pics');
//REMOVE AFTER DEV
      console.log(currentImages);
      return currentImages;
    });
  };

  var getImages = function(){
    return currentImages;

  };

  return {
            getmap: getmap,
            getPhoto: getPhoto,
            getImages: getImages,
            markMap: markMap

         };
});
