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
var authRouter = require('./routes/authRouter');

var keys = require('./config.js');
var app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({secret: 'spaghetti',
                key: 'whatisauth',
                saveUninitialized: true,
                resave: true
                }));

app.use(favicon(path.join(__dirname, 'public/Assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/search', apiRouter);
app.use('/auth', authRouter);
app.use('/echo', echoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

module.exports = app;
