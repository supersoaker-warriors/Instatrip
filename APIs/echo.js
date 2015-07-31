//echo.js
var request = require('request');
var keys = require('../config.js');
var prettyJson = require('prettyjson');

//module.exports = {
//37.774950000000004
//-122.41929
//
var obtainEchoData = function(latLng, index, pusher){
  console.log(latLng);
  var lat = latLng.lat;
  var lng = latLng.lng;
  request({
      url: 'http://developer.echonest.com/api/v4/song/search', //URL to hit
      qs: {
            api_key: keys.EchoApiKey, 
            format: "json",
            results: 1,
            min_latitude: lat-.3,
            max_latitude: lat+.3,
            min_longitude: lng-.4,
            max_longitude: lng+.4,
            sort: "song_hotttnesss-desc",
            bucket: "artist_location"
            //TODO: make this bucket work without overwriting other bucket
            //bucket: "id:spotify"
           }, //Query string data
      method: 'GET' //Specify the method
      // headers: { //We can define headers too
      //     // 'Content-Type': 'MyContentType',
      //     // 'Custom-Header': 'Custom Value'
      // }
  }, function(error, response, body){
      if(error) {
          console.log(error);
      } else {
          var objBody = JSON.parse(body);
          console.log(objBody.response);
          if(objBody.response.songs){
          
            var song = objBody.response.songs[0];
            console.log("song!: ", song);
            pusher(index, song);
          } else {
            console.log("no songs!");
            pusher(index, {song: "blank"});
          }
      }
  });
};
var songsIterator = function(latLngArr, nextCB){
//We have a multitude of async calls, and need to keep songs in the proper order.
//The songs each make one call to the songsearch api, and are then inserted into the array
//at the proper index (regardless of the return order).  
  var counter = 0;
  var maxLength = latLngArr.length;
  console.log("Iterator Length: ", maxLength);
  var resultContainer = [];
  var pusher = function(index, song){
    resultContainer[index] = song;
    counter ++;
    if (counter === maxLength){
        nextCB(resultContainer);
    }
  }
  console.log("latLngLngth: ", latLngArr.length);
  for(var i=0; i<latLngArr.length; i++){
    obtainEchoData(latLngArr[i], i, pusher);
  }
}
//Dummy Data:
// var songs = [{lat: 37.774950000000004,
// lng: -122.41929},
// {lat: 39.311800000000005,
// lng: -120.62939000000001},
// {lat: 40.20185,
// lng: -118.42795000000001},
// {lat: 40.61565,
// lng: -116.8957}]
// songsIterator(songs, function(arr){
  
//   console.log("nextCB called! ", arr);
// });

module.exports = {
  songsIterator: songsIterator
};