var express = require('express');
var instagram = require('../APIs/insta');
var passport = require('passport');
var router = express.Router();

// GET photo data based on POSTed map coordinates
// router.post('/', function(req, res) {
//   var coords = req.body.coords;
//   var responder = function(data){
//     res.send(JSON.stringify(data));
//   };
//   instagram.obtainInstaData(coords, responder);
// });
// implicit /auth/login because we said use /auth in app
// router.get('/login', function(req, res) {
//   res.send('login page from authrouter :) !');
// });
// this is what i should get from angular
router.get('/instagram',
  passport.authenticate('instagram'));
// this is what the callback goes to (change api callback to /auth/instagram/callback)
router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/#/display' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('req, ', req);
    console.log('res, ', res);
    res.redirect('/#/display');
  });
var app = express();

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



