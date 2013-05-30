var fs = require("fs");
var sqlite3 = require('node-sqlite3').verbose();
var db = new sqlite3.Database('./Alarms.db');

fs.exists('./Alarms.db', function(exists){
	//console.log("Yeah, I see it. Its totally there.");
});

//The DB query to create the table
//CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY AUTOINCREMENT, hour TEXT NOT NULL, minute TEXT NOT NULL, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, sun INTEGER, comment TEXT);
//INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('22', '30', '1', '1', '1', '1', '1', '0', '0', 'Hunt Werewolfs');
//INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('09', '25', '0', '0', '0', '0', '0', '1', '1', 'Stash Cheese in mouth.');


//Return all alarms, Requires Callback function
exports.getAlarms = function(cb){
	db.serialize(function() {
		db.all("SELECT * FROM alarms", function(err, row) { //Get all alarms
			if(!err){
				cb(row); //Return alarms to callback
			} else {
				consolelog(err); //Prints massive error
			}
		});
	});
};//

//Adds a new alarm to database
exports.addAlarm = function(hour, minute, cb){
	db.serialize(function(){
		var stmt = db.prepare("INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)");
		stmt.run(hour, minute, 0, 0, 0, 0, 0, 0, 0, 'No Comment').finalize(cb());
	});
};//

//Deletes an alarm based on id
exports.deleteAlarm = function(id, cb){
	db.serialize(function(){
		db.exec("DELETE FROM alarms WHERE id IN ("+id+")", function(err, row){
			if(!err){
				cb(true);
			} else {
				cb(false);
			}
		});
	});
};

exports.checkForAlarm = function(time){
	//Creates a specific query string for current time.

	//Searches database for that time

	//If time is found, delete it, unless it has a day set

	//Return action to be triggered.

	//Return false if not found.

};