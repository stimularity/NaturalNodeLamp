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

	this.on('addAlarm', function(alarm){
		//index of : - Take everything before that
		var hour = parseInt(alarm.substring(0, alarm.indexOf(':')),10);
		//Minute, between : and M-1
		var minute = parseInt(alarm.substring(alarm.indexOf(':')+1, alarm.indexOf('M')-1),10);
		//Get meridian of alarm
		var meridian = alarm.substring(alarm.indexOf('M')-1,alarm.length);
		//Adjust for military time.
		if(meridian == 'PM'){ hour+=12; }
		var date = new Date();
		//Save alarm
		db.addAlarm(hour, minute, date.getDay(), function(data){
		//On success
		self.emit('refreshAlarms'); //Get all the alarms, this will trigger refresh and send to user.
		});
	});

	this.on('deleteAlarm', function(id){
		console.log('Getting rid of an alarm with id ' + id);
		db.deleteAlarm(id, function(itworked){
			if(itworked){
				//self.emit('refreshAlarms'); //Get alarms triggers refreshAlarms event.
				//todo Replace this with a Send-message-to-user event.
			}
		});
	});

	//Updates a specific field with a given value.
	this.on('updateAlarm', function(id, field, value){
		db.updateAlarm(id, field, value, function(success){
			if(success){
				self.emit('refreshAlarms');
			}
		});
	});

	//Update the user interface every 2 seconds.
	setInterval(function(){
		self.emit('updateUserInterface', currentTime()); //Exports server values to UI 
	}, 500);

	//Check For alarms once every minute
    setInterval(function(){
		//self.emit('tick', currentTime()); //Send current time to user
		//console.log('Server Time ' + currentTime());

		weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

		var d = new Date();
		var hour = d.getHours();
		var minute = d.getMinutes();
		var day = weekday[d.getDay()];

		//check for set alarms.
		db.checkForAlarm(hour, minute, day, function(alarmtype){
			self.emit('alarm', alarmtype, 0); //interface(id, value);
		});
    },60000);//1000);


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