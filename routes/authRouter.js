var express = require('express');
var instagram = require('../APIs/insta');
var passport = require('passport');
var authRouter = express.Router();
var config = require('../config.js');
var request = require('superagent');

// this is what i should get from angular
authRouter.get('/instagram', function(req, res) {
  res.redirect('https://api.instagram.com/oauth/authorize/?client_id='+ config.InstaClientID +'&redirect_uri='+ config.callback_url +'&response_type=code');
});
  // console.log('hi'));
  // passport.authenticate('instagram'));

// this is what the callback goes to (change api callback to /auth/instagram/callback)
authRouter.get('/instagram/callback', function(req, res) {
  var code = req.query.code;
  console.log('code is: ', code);
  console.log('client_id is: ', config.InstaClientID);
  var test = {
    'client_id': config.InstaClientID,
    'client_secret': config.InstaClientSecret,
    'grant_type': 'authorization_code',
    'redirect_uri': config.callback_url,
    'code': code
  };

  request.post('https://api.instagram.com/oauth/access_token')
  .send('client_id=' + config.InstaClientID)
  .send('client_secret=' + config.InstaClientSecret)
  .send('grant_type=' + 'authorization_code')
  .send('redirect_uri=' + config.callback_url)
  .send('code=' + code)
  .end(function(err, instaRes) {
    console.log(instaRes.body);
    console.log('req ', req);
    console.log('res ', res);
    res.send(instaRes.body);
  });

});
  // passport.authenticate('instagram', { failureRedirect: '/#/display' }),
  // function(req, res) {
  //   // Successful authentication, redirect home.
  //   res.send(function() {
  //     console.log('hey');
  //   });
  // });
var app = express();

module.exports = authRouter;



