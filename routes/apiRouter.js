var express = require('express');
var instagram = require('../APIs/insta');
var router = express.Router();
var passport = require('passport-instagram');

// GET photo data based on POSTed map coordinates
router.post('/', function(req, res) {
  var coords = req.body.coords;
  var responder = function(data){
  	console.log(data[0][0].url);
    res.send(JSON.stringify(data));
  };
  instagram.obtainInstaData(coords, responder);
});

// app.get('/auth/instagram',
//   passport.authenticate('instagram'));

// app.get('/auth/instagram/callback',
//   passport.authenticate('instagram', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

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



