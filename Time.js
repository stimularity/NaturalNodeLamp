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

	function currentTime(current_time){
		var hours = current_time.getHours();
		var minutes = current_time.getMinutes();
		var seconds = current_time.getSeconds();

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

	/**
	 * Prints the sunrise or sunset times and formats them in
	 * an easily readable string
	 * @param  {Date} in_date javascript Date() object
	 * @return {string}         Readable solar event string.
	 */
	function solarEvents(in_date){
		solartimes = new sun.getTimes(in_date, lat, lon); //Solar times
		ctime = in_date;
		//Calculate sunrise - Default
		hours =  Math.abs(solartimes.sunrise.getHours() - ctime.getHours());
		minutes = Math.abs(solartimes.sunrise.getMinutes() - ctime.getMinutes());
		description = 'Sunrise in ';

		//console.log(ctime.getHours() +' '+ solartimes.sunset.getHours());

		if(ctime.getHours() > solartimes.sunrise.getHours() && ctime.getHours() <= solartimes.sunset.getHours()){
			if(solartimes.sunset.getMinutes() >= ctime.getMinutes()){
				hours =  Math.abs(solartimes.sunset.getHours() - ctime.getHours());
				minutes = Math.abs(solartimes.sunset.getMinutes() - ctime.getMinutes());
				description = 'Sunset in ';
			}
		}

		//String formatting.
		minutestring = ' minutes';
		if(minutes == 1){ minutestring = ' minute'; }
		hourstring = ' hours and ';
		if(hours == 1){ hourstring = ' hour and '; }
		if(hours == 0){ hourstring = ''; hours = ''; }

		return description + hours + hourstring + minutes + minutestring + '';
	}

	/**
	 * Adds an alarm to the database via an event.
	 * Then emits an update alarm event on success
	 * @param  {[type]} alarm [description]
	 * @return {[type]}       v
	 */
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
			self.emit('refreshAlarms'); //Get all the alarms, this will trigger refresh and send to user.
		});
	});

	this.on('deleteAlarm', function(id){
		console.log('Getting rid of an alarm with id ' + id);
		db.deleteAlarm(id, function(itworked){
			if(itworked){
				//self.emit('refreshAlarms'); //Get alarms triggers refreshAlarms event.
				//todo Replace this with a Send-message-to-user event.
				//No return information is needed.
			}
		});
	});

	//Updates a specific field with a given value.
	this.on('updateAlarm', function(id, field, value){
		db.updateAlarm(id, field, value, function(success){
			if(success){
				self.emit('refreshAlarms'); //Tells UI to refresh alarms element.
			}
		});
	});

	//Update the user interface every half second.
	setInterval(function(){
		self.emit('updateUserInterface', currentTime(new Date())+' '+solarEvents(new Date())); //Exports server values to UI
	}, 500);

	/**
	 * Checks for alarm. This function drives the entire alarm clock.
	 * Each minute a very specific query is made on the database.
	 * If the query returns anything the specific action is triggered.
	 * Without this function there is no alarm.
	 * 
	 * Activate - Every 60 seconds
	 * Emit - alarm('alarm', alarmtype, 0)
	 */
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

};

//Export an event emiter 
util.inherits(Time, EventEmitter);
module.exports = Time;