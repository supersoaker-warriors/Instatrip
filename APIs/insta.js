var instagram = require('instagram-node-lib');
var keys = require('../config.js');
var debug = require('debug')('server');
instagram.set('client_id', keys.InstaClientID);
instagram.set('client_secret', keys.InstaClientSecret);

module.exports = {

  getInstaData : function(latitude, longitude, distance, callback){
      instagram.media.search({lat: latitude, lng: longitude, distance: distance, complete: function(data){
      callback(data);
    }});
    // instagram.tags.search({q: "hello", complete:function(data){
    //   console.log(data);
    //   callback(data);
    //   }});
    // instagram.media.popular({complete: function(data){
    //   console.log(data.length);
    //   // callback(data);
    // }});
  },

  sortInstaData: function(photos, coords){
        var origin = coords[0];
        var destination = coords[coords.length -1];
        // for (var i = 0; i < coords.length; i++){
        //   console.log(i + "long - " + coords[i].lng + " lat -" + coords[i].lat);
        // }
        // console.log ("origin longitude: ", origin.lng);
        // console.log("destination longitude: ", destination.lng);
        // Sort photos based on longitude and direction of travel
        // if(origin.lat < destination.lat){
        //   if(origin.lng > destination.lng){
        //     console.log("A is southwest of B");
        //    return photos;
        //   }
        // }
        if (origin.lat > destination.lat){
          photos.sort(function(a, b){
            return b[0].location.latitude - a[0].location.latitude;
          });
        } else {  
          photos.sort(function(a, b){
            return a[0].location.latitude - b[0].location.latitude;
          });
        }

        return photos;
  },

  // call to instagram for each coordinate set and return to client
  obtainInstaData : function(coords, callback){
    var results = [];
    var lat, lng, dist = 300; // dist unit: m, max: 5000m

    // parse instagram data object
    var photoParser =  function(data){
      var photoArray = [];
      for(var i = 0; i < data.length; i++){
        photoArray.push({
          link: data[i].link,
          url: data[i].images.low_resolution.url,
          location: data[i].location
        });
      }
      results.push(photoArray);

      // check if all api calls have been processed, sort, return to client
      if (results.length === coords.length){
        results = this.sortInstaData(results, coords);
        callback(results);
      }
    };

    for (var i = 0; i < coords.length; i++){
      lat = coords[i].lat;
      lng = coords[i].lng;
      this.getInstaData(lat, lng, dist, photoParser.bind(this));
    }

  }

  // get your photos
  // getMyData: function(){
  //   instagram.user.self.media()
  // };

};
