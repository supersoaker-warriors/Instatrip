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

// echoRouter.post('/echo', function(req, res) {
//   console.log("echo router called!")
//   var coords = req.body.coords;
//   var echoResponder = function(data){
//     res.send(JSON.stringify(data));
//   };
//   echo.songsIterator(coords, echoResponder);
// });
router.get('/login', function(req, res) {
  res.send('login page!');
});

module.exports = router;



