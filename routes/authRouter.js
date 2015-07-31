var express = require('express');
var instagram = require('../APIs/insta');
var passport = require('passport');
var authRouter = express.Router();

// this is what i should get from angular
authRouter.get('/instagram',
  passport.authenticate('instagram'));
// this is what the callback goes to (change api callback to /auth/instagram/callback)
authRouter.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/#/display' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send(function() {
      console.log('hey');
    });
  });
var app = express();

module.exports = authRouter;



