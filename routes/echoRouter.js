//echoRouter.js
var express = require('express');
var echo = require('../APIs/echo');
var echoRouter = express.Router();

echoRouter.post('/', function(req, res) {
  console.log("echo router called!")
  console.log(req.body);
  var coords = req.body;
  var echoResponder = function(data){
    res.send(JSON.stringify(data));
  };
  echo.songsIterator(coords, echoResponder);
});
module.exports = echoRouter;