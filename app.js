/*
 * Welcome, Essential Packages
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');
var app = express();
var server = http.createServer(app);

var leds = require('./Leds'); //No interface, base of all library functions.
var Time = require('./Time'); //Global Timer and time function.
var timer = new Time(); // create an instance of the Time class

/*
 * Load Animations
 */
var animations = [];
require("fs").readdirSync("./animations").forEach(function(file) {
  var filename = file.slice(0, -3);
  animations[filename] = require("./animations/"+filename);
  animations[filename].init(leds);
  console.log('animations['+file.slice(0, -3)+']');
});


/*
 * Express Server
 */
app.configure(function(){
  app.set('port', process.env.PORT || 80); //Set port
  app.set('views', __dirname + '/views'); //Dirname for templates
  app.set('view engine', 'ejs'); //Use EJS templating engine
  app.use(express.favicon()); //Use the express favicon
  app.use(express.logger('dev')); //Set environment
  app.use(express.bodyParser()); //Does something
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public'))); //Expose public directory
});

app.get('/', routes.index); //We currently ONLY need index route.

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/*
 * Sockit.io 
 */
var io = require("socket.io").listen(server, {log: false}); //Start socket.io
//Socket.io bondings for events, yo! 
io.sockets.on('connection', function (socket) {
  /*
   * GOING OUT >----------->
   */

  //Update server time for user
  timer.on('tick', function(time){
    socket.emit('servertime', { servertime: time });
  });

  /*
   * COMING IN <-----------<
   */

  //Update an existing alarm, no blocking
  socket.on('updateAlarm', function(alarm){
    timer.emit('updateAlarm', alarm);
  });

  //Adds a new alarm to database
  socket.on('addAlarm', function(alarm){
    timer.emit('addAlarm', alarm);
  });

  //Deletes an existing alarm
  socket.on('deleteAlarm', function(alarm){
    timer.emit('deleteAlarm', alarm);
  });

  //Triggered by buttons or sliders
  socket.on('interact', function(d){
    runAnimation(d['id'],d['value']);
  });


});//End Socket.io

timer.on('alarm', function(id, value) {
    console.log('♬ ♫♬ ALARM ♬ ♫♬');
    console.log(id + " " + value);
    ///runAnimation(id, value);
});

/*
 * Events Area (Members Only)
 */


/*
 * Misc Functions
 */
function runAnimation(id, value){
  //console.log('Runnig animation ' + id + ', value: ' + value);
  for(var x in animations){
    animations[x].interface(id, value);
  }
}



