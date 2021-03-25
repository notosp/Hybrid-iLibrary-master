var url = require('url');

module.exports = function (client_id, app_url, callback){
  var loginWindow = window.open('https://www.facebook.com/dialog/oauth?response_type=token&client_id=' + client_id + '&redirect_uri=' + app_url, 'Login facebook', false);
  var out = {};
  loginWindow.addEventListener('load', function(){
    url.parse(loginWindow.document.URL).hash.substring(1).split('&').forEach(function(p){
      var a = p.split('=');
      out[ a[0] ] = a[1];
    });

    if (out.access_token){
      loginWindow.close();
      callback(out);
    }
  });
};