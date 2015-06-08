var http = require('http');
var url = require("url");
var path = require('path');

function serv(req,res){
	var pathname = url.parse(req.url).pathname;
	console.log("Request for " + pathname + " received.");
	switch(path.extname(pathname.slice(1))) {
		case '.html':
		res.writeHead(200, {'Content-Type': 'text/html'});
		break;
		case '.js':
		res.writeHead(200, {'Content-Type': 'text/javascript'});
		break;
		case '.css':
		res.writeHead(200, {'Content-Type': 'text/css'});
		break;
	}
	var fs = require('fs');
	fs.readFile(pathname.slice(1), function (err, data){
		if (err) {
			res.end("File wasn't found");
		}
		else
			res.end(data);
	});
}
http.createServer(serv).listen(1337,'127.0.0.1');
console.log('Server create');
