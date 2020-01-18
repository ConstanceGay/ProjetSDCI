var express = require('express')
var app = express()
app.use(express.json()) // for parsing application/json

var request = require('request');
const si = require('systeminformation');
var argv = require('yargs').argv;
var index = 1;

var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var REMOTE_ENDPOINT1 = {IP : argv.remote_ip1, PORT : argv.remote_port1, NAME : argv.remote_name1};
var REMOTE_ENDPOINT2 = {IP : argv.remote_ip2, PORT : argv.remote_port2, NAME : argv.remote_name2};

const E_OK              = 200;
const E_CREATED         = 201;
const E_FORBIDDEN       = 403;
const E_NOT_FOUND       = 404;
const E_ALREADY_EXIST   = 500;

function doPOST(uri, body, onResponse) {
    request({method: 'POST', uri: uri, json : body}, onResponse); 
}

app.post('/device/:dev/data', function(req, res) {
    index = 1 - index;
    console.log(req.body);
    var dev = req.params.dev;
    if (index == 0){
    console.log("Sending to gateway1");
    console.log(REMOTE_ENDPOINT.IP)
	    doPOST(
		'http://' + REMOTE_ENDPOINT.IP + ':' +REMOTE_ENDPOINT.PORT + '/device/' + dev + '/data',
		req.body,
		function(error, response, respBody) {
		    console.log(respBody);
		    res.sendStatus(E_OK); 
		}
	    )
    }
    if (index == 1) {
    	console.log("Sending to gateway2");
        console.log(REMOTE_ENDPOINT2.IP)
	doPOST(
		'http://' + REMOTE_ENDPOINT2.IP + ':' +REMOTE_ENDPOINT2.PORT + '/device/' + dev + '/data',
		req.body,
		function(error, response, respBody) {
		    console.log(respBody);
		    res.sendStatus(E_OK); 
		}
	    )

    }
});

app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' listening on : ' + LOCAL_ENDPOINT.PORT );
});
