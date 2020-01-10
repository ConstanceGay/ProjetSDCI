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
// desired arguments in the following order
// --local_ip
// --local_port
// --local_name
// --monitor_ip
// --monitor_port
// --monitor_name


var LOCAL_ENDPOINT = {IP : argv.local_ip, PORT : argv.local_port, NAME : argv.local_name};
var MONITOR_ENDPOINT = {IP : argv.monitor_ip, PORT : argv.monitor_port, NAME : argv.monitor_name};



var os = require("os");

//Create function to get CPU information
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

//Grab first CPU Measure
var startMeasure = cpuAverage();

//Set delay for second Measure
setTimeout(function() { 

  //Grab second Measure
  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  //Output result to console
  console.log(percentageCPU + "% CPU Usage.");

}, 100);





// load average for the past 1000 milliseconds

var cpuDataItem = CPULoad(1000, (load) => console.log((100*load).toFixed(1)));

function sendData() {
    doPOST(
        'http://' + MONITOR_ENDPOINT.IP + ':' + MONITOR_ENDPOINT.PORT + '/cpudata/'+ LOCAL_ENDPOINT.NAME,
        {
            Name : LOCAL_ENDPOINT.NAME,
            Data : cpuDataItem++,
            Time : Date.now(),
        },
        function(error, response, respBody) {
            console.log(respBody);
        }
    );
}

app.get('/cpulat', function(req, res) {
    sendData()
});


app.listen(LOCAL_ENDPOINT.PORT , function () {
    console.log(LOCAL_ENDPOINT.NAME + ' (from cpulat.js) listening on : ' + LOCAL_ENDPOINT.PORT );
});
