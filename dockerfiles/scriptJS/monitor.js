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
var GI_ENDPOINT = {IP : argv.gi_ip, PORT : argv.gi_port, NAME : argv.gi_name};



// cpu load of the monitored component
function askCpu(ip, port) {
    var cpuLoad = parseInt(request('http://' + ip + ':' + port + '/cpulat'), 10);
    return cpuLoad;
}

// network latency of the monitored component
function getLatency(ip, port){
    var i;    
    var start;
    var lat = 0;
    for (i = 0; i<50; i++) {
        var start = Date.now();
        request('http://'+ip+':'+port+'/ping');
        lat += Date.now() - start;
    }
    lat = lat/50;
    return lat;
}



app.get('/monitor', function(req, res) {
    console.log(req.body);
    cpuSRV = askCpu(SRV_ENDPOINT.IP, SRV_ENDPOINT.PORT);
    cpuGI = askCpu(GI_ENDPOINT.IP, GI_ENDPOINT.PORT);
    latSRV = getLatency(SRV_ENDPOINT.IP, SRV_ENDPOINT.PORT);
    latGI = getLatency(GI_ENDPOINT.IP, GI_ENDPOINT.PORT);
    res.send({CPUSRV : cpuSRV}, {CPUGI : cpuGI}, {LATSRV : latSRV}, {LATGI : latGI});
});



app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' (from monitor.js) listening on : ' + LOCAL_ENDPOINT.PORT );
});
