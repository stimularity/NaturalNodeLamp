var util = require('util');
var EventEmitter = require('events').EventEmitter;
var fs = require("fs");

var sqlite3 = require('node-sqlite3').verbose();
var db = new sqlite3.Database('./Alarms.db');

//The DB query to create the table
//CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT NOT NULL, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, sun INTEGER, comment TEXT);
//INSERT INTO alarms (time, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('2250', '1', '1', '1', '1', '1', '0', '0', 'Hunt Werewolfs');
//INSERT INTO alarms (time, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('0930', '0', '0', '0', '0', '0', '1', '1', 'Stash Cheese in mouth.');



// @station - an object with `freq` and `name` properties
var Time = function(station) {
	// we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those funtions, not the Radio class
    var self = this;

    //Attempt to open database if its not there, just whip one up
    

    fs.exists('./Alarms.db', function(exists){
    	console.log("Yeah, I see it. Its totally there.");
    });
    
    self.on('updateAlarm', function(alarm){

    });

    self.on('addAlarm', function(alarm){
    	
    });

    self.on('deleteAlarm', function(alarm){
    	
    });

    self.on('getAlarm', function(alarm){
    	
    });


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
	function checkForAlarms(){
		//Check for alarms, if match is found, emit alarm event.
	}

	//Trigger tick every minute. (10 for testing.)
    setInterval(function(){
		self.emit('tick', currentTime());
		//check for set alarms.
		checkForAlarms(); //Check database for alarms at current time.
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