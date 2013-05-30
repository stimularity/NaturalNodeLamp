var util = require('util');
var EventEmitter = require('events').EventEmitter;
var db = require('./Database'); //All Database access functions





// @station - an object with `freq` and `name` properties
var Time = function(station) {
	// we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those funtions, not the Radio class
    var self = this;

	function currentTime(){
		var ctime = new Date();
		var hours = ctime.getHours();
		var minutes = ctime.getMinutes();
		var seconds = ctime.getSeconds();

		if(minutes < 10){
			minutes = "0" + minutes;
		}
		var suffix = "AM";
		if(hours >= 12){
			suffix = "PM";
			hours = hours - 12;
		}
		if(hours === 0){
			hours = 12;
		}
		return hours + ":" + minutes + " " + suffix;
	}

	//Gets all the alarms. Async, trigger refresh Alarms when complete
	this.on('getAlarms', function(){
		console.log('Getting a whole bunch of alarms for you dog.');
		db.getAlarms(function(data){
			self.emit('refreshAlarms',{ alarms: data}); //Sends alarm data back to socket.io when ready
		});
	});

	this.on('addAlarm', function(alarm){
		console.log('Adding an alarm for you bro. Break that alarm into parts!');
		//Parse time and make sure its a valid alarm.
		var hour = 10, minute = 10;


		db.addAlarm(hour, minute, function(data){
			//On success
			self.emit('getAlarms'); //Get all the alarms, this will trigger refresh and send to user.
		});
	});

	this.on('deleteAlarm', function(id){
		console.log('Getting rid of an alarm with id ' + id);
		db.deleteAlarm(id, function(itworked){
			if(itworked){
				self.emit('getAlarms'); //Get alarms triggers refreshAlarms event.
			}
		});
	});

	//Trigger tick every minute. (10 for testing.)
    setInterval(function(){
		self.emit('tick', currentTime());
		db.checkForAlarm(); //check for set alarms.
    },1000);//60000);


    /*
    // Display subscribed functions.
    this.on('newListener', function(listener) {
        console.log('New Listener: ' + listener);
    }); */
};

// extend the EventEmitter class using our Radio class
util.inherits(Time, EventEmitter);
// we specify that this module is a refrence to the Radio class
module.exports = Time;