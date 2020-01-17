var express = require('express')
var app = express()
app.use(express.json()) // for parsing application/json

var request = require('request');
const si = require('systeminformation');
var argv = require('yargs').argv;
// desired arguments in the following order
// --local_ip
// --local_port
// --local_name
// --remote_ip
// --remote_port
// --remote_name



var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var REMOTE_ENDPOINT = {IP : argv.remote_ip, PORT : argv.remote_port, NAME : argv.remote_name};

const E_OK              = 200;
const E_CREATED         = 201;
const E_FORBIDDEN       = 403;
const E_NOT_FOUND       = 404;
const E_ALREADY_EXIST   = 500;



var db = {
        gateways : new Map()
    };

function addNewGateway(gw) {
    var res = -1;
    if (!db.gateways.get(gw.Name)) {
        db.gateways.set(gw.Name, gw);
        res = 0;
    }
    return res;
}

function removeGateway(gw) {
    if (db.gateways.get(gw.Name))
        db.gateways.delete(gw.Name);
}
    

function doPOST(uri, body, onResponse) {
    request({method: 'POST', uri: uri, json : body}, onResponse); 
}

function register() {
    doPOST(
        'http://' + REMOTE_ENDPOINT.IP + ':' + REMOTE_ENDPOINT.PORT + '/gateways/register', 
        {
            Name : LOCAL_ENDPOINT.NAME, 
            PoC : 'http://' + LOCAL_ENDPOINT.IP + ':' + LOCAL_ENDPOINT.PORT, 
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}



///////////////////////////
//CPU LOAD DETECTION PART//
///////////////////////////

var os = require("os");

// found on https://gist.github.com/bag-man/5570809
function cpuAverage() {
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

// found on https://gist.github.com/bag-man/5570809
function CPULoad(avgTime, callback) {
  this.samples = [];
  this.samples[1] = cpuAverage();
  this.refresh = setInterval(() => {
    this.samples[0] = this.samples[1];
    this.samples[1] = cpuAverage();
    var totalDiff = this.samples[1].total - this.samples[0].total;
    var idleDiff = this.samples[1].idle - this.samples[0].idle;
    callback(1 - idleDiff / totalDiff);
  }, avgTime);
}



app.get('/cpulat', function(req, res) {
    console.log(req.body);
    // load average for the past 1000 milliseconds
    var cpuDataItem = CPULoad(1000, (load) => console.log((100*load).toFixed(1)));

    res.write(cpuDataItem.toString());
    res.end();
});

app.post('/gateways/register', function(req, res) {
    console.log(req.body);
    var result = addNewGateway(req.body);
    if (result === 0)
        res.sendStatus(E_CREATED);  
    else
        res.sendStatus(E_ALREADY_EXIST);  
 });
app.post('/devices/register', function(req, res) {
    console.log(req.body);
    doPOST(
        'http://' + REMOTE_ENDPOINT.IP + ':' +REMOTE_ENDPOINT.PORT + '/devices/register',
        req.body,
        function(error, response, respBody) {
            console.log(respBody);
            res.sendStatus(E_OK); 
        }
    )
 });
 app.post('/device/:dev/data', function(req, res) {
    console.log(req.body);
    var dev = req.params.dev;
    doPOST(
        'http://' + REMOTE_ENDPOINT.IP + ':' +REMOTE_ENDPOINT.PORT + '/device/' + dev + '/data',
        req.body,
        function(error, response, respBody) {
            console.log(respBody);
            res.sendStatus(E_OK); 
        }
    )
});
app.get('/gateways', function(req, res) {
    console.log(req.body);
    let resObj = [];
    db.gateways.forEach((v,k) => {
        resObj.push(v);
    });
    res.send(resObj);
});
app.get('/gateway/:gw', function(req, res) {
    console.log(req.body);
    var gw = req.params.gw;
    var gateway = db.gateways.get(gw);
    if (gateway)
        res.status(E_OK).send(JSON.stringify(gateway));
    else
        res.sendStatus(E_NOT_FOUND);
});

app.get('/ping', function(req, res) {
    console.log(req.body);
    res.status(E_OK).send({pong: Date.now()});
});
app.get('/health', function(req, res) {
    console.log(req.body);
    si.currentLoad((d) => {
        console.log(d);
        res.status(E_OK).send(JSON.stringify(d));
    })
});


register();
app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' listening on : ' + LOCAL_ENDPOINT.PORT );
});