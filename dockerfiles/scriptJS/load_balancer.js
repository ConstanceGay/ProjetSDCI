var http = require('http');
var url = require('url');
const forward = require('http-forward');
var index = 1;
var argv = require('yargs').argv;

var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var REMOTE_ENDPOINT1 = {IP : argv.remote_ip, PORT : argv.remote_port, NAME : argv.remote_name};
var REMOTE_ENDPOINT1 = {IP : argv.remote_ip, PORT : argv.remote_port, NAME : argv.remote_name};

http.createServer(function (req, res) {
	index = 1 - index;
	if (index == 0) {
	   console.log(req.body);
    	   req.forward = {target:'http://' + REMOTE_ENDPOINT1.IP + ':' + REMOTE_ENDPOINT1.PORT + '/'};
    	   forward(req, res);
	}
	if (index == 1) {
	   console.log(req.body);
    	   req.forward = {target:'http://' + REMOTE_ENDPOINT2.IP + ':' + REMOTE_ENDPOINT2.PORT + '/'};
    	   forward(req, res);
	}
}).listen(8181);
