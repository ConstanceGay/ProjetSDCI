var express = require('express')
var app = express()
app.use(express.json()) 

var request = require('request');
const si = require('systeminformation');
var argv = require('yargs').argv;
// desired arguments in the following order
// --local_ip
// --local_port
// --local_name
// --monitor_ip
// --monitor_port
// --monitor_name



var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
// var MONITOR_ENDPOINT = {IP : argv.monitor_ip, PORT : argv.monitor_port, NAME : argv.monitor_name};

const E_OK              = 200;
const E_CREATED         = 201;
const E_FORBIDDEN       = 403;
const E_NOT_FOUND       = 404;
const E_ALREADY_EXIST   = 500;



// Mapping
var db = {
        devices : new Map(),
        data : new Map(),
        gateways : new Map()
    };

function addNewDevice(dev) {
    var result = -1;
    if (!db.devices.get(dev.Name)) {
        db.devices.set(dev.Name, dev);

        if (db.devices.get(dev.Name))
            db.data.delete(dev.Name);
        db.data.set(dev.Name, []);

        result = 0;
    }
    return result;
}

function addNewGateway(gw) {
    var result = -1;
    if (!db.gateways.get(gw.Name)) {
        db.gateways.set(gw.Name, gw);
        result = 0;
    }
    return result;
}

function removeDevice(dev) {
    if (db.devices.get(dev.Name)) {
        db.devices.delete(dev.Name);
        if (db.devices.get(dev.Name))
            db.data.delete(dev.Name);
    }
}

function removeGateway(gw) {
    if (db.gateways.get(gw.Name))
        db.gateways.delete(gw.Name);
}

function addDeviceData(dev, data) {
    var result = -1;
    var device = db.devices.get(dev);
    if (device) {
        db.data.get(dev).push(data);
        result = 0;
    }
    return result;
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

app.get('/devices', function(req, res) {
    console.log(req.body);
    let resObj = [];
    db.devices.forEach((v,k) => {
        resObj.push(v);
    });
    res.status(E_OK).send(resObj);
});
app.get('/device/:dev', function(req, res) {
    console.log(req.body);
    var dev = req.params.dev;
    var device = db.devices.get(dev);
    if (device)
        res.status(E_OK).send(JSON.stringify(device));
    else
        res.sendStatus(E_NOT_FOUND);
});
app.post('/device/:dev/data', function(req, res) {
    console.log(req.body);
    var dev = req.params.dev;
    var result = addDeviceData(dev, req.body);
    if (result === 0)
        res.sendStatus(E_CREATED);
    else
        res.sendStatus(E_NOT_FOUND);
});
app.get('/device/:dev/data', function(req, res) {
    console.log(req.body);
    var dev = req.params.dev;
    var device = db.devices.get(dev);
    if (device){
        var data = db.data.get(dev);
        if (data) {
            let resObj = [];
            data.forEach((v,k) => {
                resObj.push(v);
            });
            res.status(E_OK).send(JSON.stringify(resObj));
        }
        else
            res.sendStatus(E_NOT_FOUND);
    }
    else
        res.sendStatus(E_NOT_FOUND);
});
app.post('/devices/register', function(req, res) {
    console.log(req.body);
    var result = addNewDevice(req.body);
    if ( result === 0)
        res.sendStatus(E_CREATED);  
    else
        res.sendStatus(E_ALREADY_EXIST);  
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
app.post('/gateways/register', function(req, res) {
    console.log(req.body);
    var result = addNewGateway(req.body);
    if ( result === 0)
        res.sendStatus(E_CREATED);  
    else
        res.sendStatus(E_ALREADY_EXIST);  
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

app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' listening on : ' + LOCAL_ENDPOINT.PORT );
});
