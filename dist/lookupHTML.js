var http = require('http');
var path = require('path');
var fs = require('fs');
http.createServer(function (request, response) {
  var lookup = path.basename(decodeURI(request.url)) || 'index.html';
  var f = 'content/' + lookup;
  fs.exists(f, function (exists) { 
    console.log(exists ? lookup + " is there" 
    : lookup + " doesn't exist");
  });
}).listen(8080);