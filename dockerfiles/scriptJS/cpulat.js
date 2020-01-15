/**
 *  Author: Constance GAY & Pierre BINET
 *  File : cpulat.js
 *  Version : 0.1.0
 */



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
// --monitor_ip
// --monitor_port
// --monitor_name



var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var MONITOR_ENDPOINT = {IP : argv.monitor_ip, PORT : argv.monitor_port, NAME : argv.monitor_name};



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
    // load average for the past 1000 milliseconds
    var cpuDataItem = CPULoad(1000, (load) => console.log((100*load).toFixed(1)));

    res.write(cpuDataItem.toString());
    res.end();
});



app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' (from cpulat.js) listening on : ' + LOCAL_ENDPOINT.PORT );
});
