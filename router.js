var fs = require('fs');
exports.router = function(req, res) {
  if(req.url === "/") {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8' });
    res.end("hi hi");
  }
  else {
    fs.readFile('.' + req.url, function(err, data) {
      if(err) {
         res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8' });
      }
      else{
         console.log(data.toString());
         res.write(data);
      }
      res.end();
    });
  }

}