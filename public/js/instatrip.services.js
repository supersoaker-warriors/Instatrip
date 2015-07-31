angular.module('instatrip.services', [])

.factory('Getdata', function ($http, $state, CustomOverlay, $rootScope) {
  var currentImages = [];
  var currentCoords = [];
  var fullRoute;
  var Map;
  var markers = [];
  var currentMarker;
  var points = 15;
  var spoints = 90;

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
      var rendererOptions = {
        draggable: true
      };
      directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
      var MakerSquare = new google.maps.LatLng(37.787518, -122.399868);
      var mapOptions = {
        zoom:7,
        center: MakerSquare,
        // disableDefaultUI: true,
        draggable: true,
        zoomControl: true,
           zoomControlOptions: {
             style: google.maps.ZoomControlStyle.SMALL
           },
        mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.TERRAIN,
                    MY_MAPTYPE_ID]

        },
        mapTypeId: MY_MAPTYPE_ID
      };

      var featureOpts = [
         {
          "featureType": "all",
            "stylers": [
            {
              "color": "#1e303d"
            }
          ]
        },
        {
          "featureType": "water",
          "stylers": [
            {
              "color": "#0e171d"
            }
          ]
        },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "color": "#1e303d"
            }
          ]
        },
        {
          "featureType": "water",
          "stylers": [
            {
              "color": "#0e171d"
            }
          ]
        },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "color": "#1e303d"
            }
          ]
        },
        {
          "featureType": "road",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "color": "#1e303d"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "color": "#182731"
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.icon",
          "stylers": [
            {
              "color": "#f0c514"
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1e303d"
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#e77e24"
            },
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#94a5a6"
              }
              ]
            },
            {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
            {
              "visibility": "simplified"
            },
            {
              "color": "#e84c3c"
            }
            ]
          },
        {
        "featureType": "poi",
        "stylers": [
          {
            "color": "#e84c3c"
          },
          {
            "visibility": "off"
          }
        ]
        },
      ];
      var styledMapOptions = {
        name: 'custom style'
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
      map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
      directionsDisplay.setMap(map);

      Map = map;
      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {

        var tempRoute = directionsDisplay.getDirections().routes[0].overview_path;
        fullRoute = tempRoute;
        var spacedRoute = findN(tempRoute, 15);
        var spaced = [];
        for(var i = 0; i < spacedRoute.length; i++){
          spaced.push({
            lat: spacedRoute[i].G,
            lng: spacedRoute[i].K
          });
        }
        currentCoords = spaced;
        console.log(spaced);
        ourCallback(tempRoute, spaced).then(function(data, err) {
          $rootScope.$broadcast('updatedPhotos', data);
        });


      });

      // code below listens for changes in map boundaries,
      // calculates new points depending on position and zoom
      // and pulls new pictures
      
      google.maps.event.addListener(Map, 'idle', function() {
        var bounds = map.getBounds();

        var containsArray = [];
        if (fullRoute) {     

          for (var i = 0; i < fullRoute.length; i++ ) {

            if (bounds.contains(fullRoute[i])) {
              containsArray.push(fullRoute[i]);
            }
            else {
            }
          }
          var newPoints = findN(containsArray, 15);
          var spaced = [];
          for(var i = 0; i < newPoints.length; i++){
            spaced.push({
              lat: newPoints[i].G,
              lng: newPoints[i].K
            });
          }
          ourCallback([], spaced).then(function (data, err) {
            if (err) {
              console.log(err);
            }
            $rootScope.$broadcast('updatedPhotos', data);
            
          })
        }
      });
    }

    function calcRoute(start, end, travelMethod, callback) {

      var travelMethod = travelMethod || 'DRIVING';
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
    fullRoute = routes;

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
    for (var j = 0; j < currentImages.length; j++){
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
    // remove all of the markers except the one need to be marked
    // To add or remove the marker to the map, call setMap();
    for (j = 0; j < currentImages.length; j++){
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
            markMap: markMap,
            currentImages: currentImages
         };
});
