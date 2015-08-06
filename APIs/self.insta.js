var request = require('superagent');

module.exports = function(token, callback) {
  request.get('https://api.instagram.com/v1/users/self/media/recent/?access_token='+token)
  .set('access_token', token)
  .end(function(err, response) {
    if (err) {
      console.log('err');
    } else {
      // console.log(response.body);
      callback(response.body);
    }
  });
};
