var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var instagram = require('./APIs/insta.js');

var session = require('express-session');
var apiRouter = require('./routes/apiRouter');

var echoRouter = require('./routes/echoRouter');
var echo = require('./APIs/echo');

var authRouter = require('./routes/authRouter');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var keys = require('./config.js');
var app = express();


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(session({secret: 'spaghetti',
                key: 'whatisauth',
                saveUninitialized: true,
                resave: true
                }));

// fix cors
app.use(function(req, res, next) {
res.header('Access-Control-Allow-Credentials', true);
res.header('Access-Control-Allow-Origin', req.headers.origin);
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
if ('OPTIONS' == req.method) {
     res.send(200);
 } else {
     next();
 }
});

// set up passport session
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.use(favicon(path.join(__dirname, 'public/Assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/search', apiRouter);
app.use('/auth', authRouter);
app.use('/echo', echoRouter);

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
      // keys.access_token = accessToken;
      console.log('accessToken?, ', accessToken);
      console.log('profile, ', profile);
      console.log('profile.id, ', profile.id);
      // res.cookie('accessToken', accessToken);
      return done();

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
  res.send('error', {
    message: err.message,
    error: {}
  });
});

// app.post("/", function(req, res) {
//   console.log("post called!");

//   var coords = req.body.coords;
//   res.send(JSON.stringify(coords));
//   var echoResponder = function(data){
//     res.send(JSON.stringify(data));
//   };
//   echo.songsIterator(coords, echoResponder);
// })



module.exports = app;
