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
leds.fillColor(0,0,0); //Zero out leds for 
var Time = require('./Time'); //Global Timer and time function.
var timer = new Time(); // create an instance of the Time class

/*
 * Load Animations
 */
var animations  = [];
require("fs").readdirSync("./animations").forEach(function(file) {
  var filename = file.slice(0, -3); //Get App File Name
  animations[filename] = require("./animations/"+filename); //Put into animatios array
  animations[filename].init(leds); //Init Animations, pass LED's
  console.log('animations['+file.slice(0, -3)+']'); //Tell the world how great you are
});

/*
 * Express Server
 */
app.configure(function(){
  app.set('port', process.env.PORT || 80); //Set port
  app.set('views', __dirname + '/views'); //Dirname for templates
  app.set('view engine', 'ejs'); //Use EJS templating engine
  app.set('animations', animations); //Pass animations to app for use in controlers
  app.use(express.favicon()); //Use the express favicon
  app.use(express.logger('dev')); //Set environment
  app.use(express.bodyParser()); //Does something with cookies
  app.use(express.methodOverride()); //Does something nasty with you mother
  app.use(app.router);  //For processing URLs
  app.use(express.static(path.join(__dirname, 'public'))); //Expose public directory
});

app.get('/', routes.index); //We currently ONLY need index route.
app.get('/alarms', routes.alarms); //Exports alarm data to drowser
app.get('/alarmentry', routes.alarmentry); //Displays functioning alarm entry pad
app.get('/graphical', routes.graphical); //Displays buttons to select ringer style

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
  //Refresh alarms on connect
  socket.emit('refreshAlarms'); //Tells browser to fetch alarms


  //Updates the user interface with server values
  timer.on('updateUserInterface', function(time){
    socket.emit('currentSliders', leds.r(), leds.g(), leds.b()); //Send current sliders to UI
    socket.emit('servertime', { servertime: time }); //Pushes server time to browser
  });

  //Refresh Alarms for User
  timer.on('refreshAlarms', function(){
    socket.emit('refreshAlarms'); //Tells browser to fetch alarms
  });

  /*
   * COMING IN <-----------<
   */



  //Update an existing alarm.
  socket.on('updateAlarm', function(id, field, value){
    timer.emit('updateAlarm', id, field, value );
  });

  //Adds a new alarm to database
  socket.on('addAlarm', function(alarm){
    timer.emit('addAlarm', alarm);
  });

  //Deletes an existing alarm
  socket.on('deleteAlarm', function(id){
    timer.emit('deleteAlarm', id);
  });

  //Triggered by buttons or sliders
  socket.on('interact', function(d){
    runAnimation(d['id'],d['value']);
  });


});//End Socket.io


/*
 * Events Area (Members Only)
 */

timer.on('alarm', function(id, value) {
    console.log('♬ ♫♬ ALARM ♬ ♫♬');
    console.log(id + " " + value);
    runAnimation(id, value);
});


/*
 * Misc Functions
 */
function runAnimation(id, value){
  //console.log('Runnig animation ' + id + ', value: ' + value);
  for(var x in animations){
    animations[x].interface(id, value);
  }
}


