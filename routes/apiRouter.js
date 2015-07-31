var express = require('express');
var instagram = require('../APIs/insta');
var router = express.Router();
var passport = require('passport');



// GET photo data based on POSTed map coordinates
router.post('/', function(req, res) {
  var coords = req.body.coords;
  var responder = function(data){
    res.send(JSON.stringify(data));
  };
  instagram.obtainInstaData(coords, responder);
});

router.get('/login', function(req, res) {
  res.send('login page!');
});


// 'https://instagram.com/oauth/authorize/?display=touch&client_id=[ClientID]
// &redirect_uri=[callbackuri]/&response_type=token'

// 'http://your-redirect-uri?code=CODE'

// '$.ajax({
//         type: "GET",
//         dataType: "jsonp",
//         cache: false,
//         url: "https://api.instagram.com/v1/users/[UserID]/media/recent/?access_token=[CODE]",
//         success: function(data) {...}
//     });
// });'

// function(data) {
//   for (var i = 0; i < 10; i++) {
//   $(".pics").append("<a target='_blank' href='" + data.data[i].link +
//   "'><img src='" + data.data[i].images.low_resolution.url +"'></img></a>");
// }
// }


module.exports = router;



