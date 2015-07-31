var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var instagram = require('./APIs/insta.js');

var session = require('express-session');
var apiRouter = require('./routes/apiRouter');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var keys = require('./config.js');
var app = express();

// set up passport session
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.use(favicon(path.join(__dirname, 'public/Assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/search', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));


// if you want to use a database, create one
if (keys.use_database === 'true') {
  // connect to database
}

passport.use(new InstagramStrategy({
  clientID: keys.InstaClientID,
  clientSecret: keys.InstaClientSecret,
  callbackURL: keys.callback_url
},
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));


// Route for form POST from landing page containing GPS coordinates

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(passport.session());
app.use(passport.initialize());
app.use(session({secret: 'spaghetti',
                key: 'whatisauth',
                saveUninitialized: true,
                resave: true
                }));



module.exports = app;
