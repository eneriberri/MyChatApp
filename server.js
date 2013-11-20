var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var createChat = require('./lib/chat_server').createChat

var router = require('./router.js').router;

http.createServer(function (request, response) {
  router(request,response);
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

createChat(app,io,fs);



// var controllers = fs.readdirSync('./public');
//
// // Require and run init method for each one
// controllers.forEach(function (controller) {
//   var controller = require('./app/controllers/' + controller);
//   controller.init(app);
// });
