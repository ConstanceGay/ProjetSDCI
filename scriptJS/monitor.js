/**
 *  Author: Constance GAY & Pierre BINET
 *  File : monitor.js
 *  Version : 0.1.0
 */



var express = require('express')
var app = express()
app.use(express.json()) // for parsing application/json

var request = require('request');
const si = require('systeminformation');
var argv = require('yargs').argv;
//desired arguments in the following order
// --local_ip
// --local_port
// --local_name
// --srv_ip
// --srv_port
// --srv_name
// --gi_ip
// --gi_port
// --gi_name



var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var SRV_ENDPOINT = {IP : argv.srv_ip, PORT : argv.srv_port, NAME : argv.srv_name};
var GI_ENDPOINT = {IP : argv.gi_ip, PORT : argv.gi_port, NAME : gi.srv_name};

const E_OK              = 200;
const E_CREATED         = 201;
const E_FORBIDDEN       = 403;
const E_NOT_FOUND       = 404;
const E_ALREADY_EXIST   = 500;



/**
// Mapping du prof
var db = {
        gateways : new Map()
    };

// add une gateway dans le mapping (?)
function addNewGateway(gw) {
    var res = -1;
    if (!db.gateways.get(gw.Name)) {
        db.gateways.set(gw.Name, gw);
        res = 0;
    }
    return res;
}

// rm une gateway dans le mapping (?)
function removeGateway(gw) {
    if (db.gateways.get(gw.Name))
        db.gateways.delete(gw.Name);
}

function registerSRV() {
    doPOST(
        'http://' + SRV_ENDPOINT.IP + ':' + SRV_ENDPOINT.PORT + '/gateways/register', 
        {
            Name : LOCAL_ENDPOINT.NAME, 
            PoC : 'http://' + LOCAL_ENDPOINT.IP + ':' + LOCAL_ENDPOINT.PORT, 
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}

function registerGI() {
    doPOST(
        'http://' + GI_ENDPOINT.IP + ':' + GI_ENDPOINT.PORT + '/gateways/register', 
        {
            Name : LOCAL_ENDPOINT.NAME, 
            PoC : 'http://' + LOCAL_ENDPOINT.IP + ':' + LOCAL_ENDPOINT.PORT, 
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}
*/



function askSRV() {
	doPOST(
        'http://' + SRV_ENDPOINT.IP + ':' + SRV_ENDPOINT.PORT + '/cpulat', 
        {
            Name : LOCAL_ENDPOINT.NAME, 
            PoC : 'http://' + LOCAL_ENDPOINT.IP + ':' + LOCAL_ENDPOINT.PORT, 
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}

function askGI() {
	doPOST(
        'http://' + GI_ENDPOINT.IP + ':' + GI_ENDPOINT.PORT + '/cpulat', 
        {
            Name : LOCAL_ENDPOINT.NAME, 
            PoC : 'http://' + LOCAL_ENDPOINT.IP + ':' + LOCAL_ENDPOINT.PORT, 
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}



function processDataGI(){
}

function processDataSRV(){
}



app.get('/cpudata/'+ GI_ENDPOINT.NAME, function(req, res) {
    processDataGI()
});

app.get('/cpudata/'+ SRV_ENDPOINT.NAME, function(req, res) {
    processDataSRV()
});



app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' (from monitor.js) listening on : ' + LOCAL_ENDPOINT.PORT );
});
