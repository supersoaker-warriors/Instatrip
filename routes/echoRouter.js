//echoRouter.js
var express = require('express');
var echo = require('../APIs/echo');
var echoRouter = express.Router();

echoRouter.post('/', function(req, res) {
<<<<<<< HEAD
  console.log("echo router called!")
  console.log(req.body);
  var coords = req.body;
=======
	console.log("this is the echo!!!",req);
  var coords = req.body.coords;
>>>>>>> [EDIT] manipulating response data from back-end
  var echoResponder = function(data){
    res.send(JSON.stringify(data));
  };
  echo.songsIterator(coords, echoResponder);
});
module.exports = echoRouter;
