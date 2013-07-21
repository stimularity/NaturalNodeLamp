var util = require('util');
var EventEmitter = require('events').EventEmitter;
var db = require('./Database'); //All Database access functions

var sun = require('suncalc'); //To calculate sundown time
var lat = 40; //Lattitude 
var lon = -105; //Longitude 

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

		if(seconds < 10){ //Add 0 if seconds is 1 char
			seconds = '0' + seconds;
		}
		if(minutes < 10){ //add 0 if minutes is 1 char
			minutes = "0" + minutes;
		}
		var suffix = "AM";
		if(hours >= 12){ //Display AM or PM and convert military time.
			suffix = "PM";
			hours = hours - 12;
		}
		if(hours === 0){ //Convert militarp time.
			hours = 12;
		}
		return hours + ":" + minutes + "."+seconds+" " + suffix;
	}

	function sunsetIn(){
		var solartimes = new sun.getTimes(new Date(), lat, lon); //Solar times
		var ctime = new Date();
		var hours =  solartimes.sunset.getHours() - ctime.getHours();
		var minutes = solartimes.sunset.getMinutes() - ctime.getMinutes();

		minutestring = ' minutes';
		if(minutes == 1){ minutestring = ' minute'; }
		hourstring = 'hours and '
		if(hours == 1){ hourstring = 'hour and '; } 
		if(hours == 0){ hourstring = ''; hours = ''; }

		//If hours contains "-" or time after 12 am
		//Show sunrise.


		return '' + hours + hourstring + minutes + minutestring + '';
		//console.log('Sunset in ' + hours + ' hours and ' + minutes + ' minutes');
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
		self.emit('updateUserInterface', currentTime()+" Sunset in "+sunsetIn()); //Exports server values to UI 
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