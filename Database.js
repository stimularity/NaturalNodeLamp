var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');//('./Alarms.db');

//Create Default database if you don't got one. 
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER NOT NULL, minute INTEGER NOT NULL, sun INTEGER, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, comment TEXT, alarmtype TEXT, enabled INTEGER)");
	//db.run("CREATE TABLE IF NOT EXISTS ringing (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER NOT NULL, minute INTEGER NOT NULL, sun INTEGER, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, comment TEXT, alarmtype TEXT, enabled INTEGER)");
	//db.run("INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('22', '30', '1', '1', '1', '1', '1', '0', '0', 'Hunt Werewolfs', 'sunrise', 1)");
	//db.run("INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('09', '25', '0', '0', '0', '0', '0', '1', '1', 'Stash Cheese in mouth.', 'colorwheel', 0)");
});


//Return all alarms, Requires Callback function
exports.getAlarms = function(cb){
	db.serialize(function() {
		db.all("SELECT * FROM alarms ORDER BY hour, minute ASC", function(err, row) { //Get all alarms
			if(!err){
				cb(row); //Return alarms to callback
			} else {
				console.log(err); //Prints massive error
			}
		});
	});
};//

//Adds a new alarm to database
exports.addAlarm = function(hour, minute, day, cb){
	days = [0,0,0,0,0,0,0];
	days[day] = 1;
	db.serialize(function(){
		var stmt = db.prepare("INSERT INTO alarms (hour, minute, sun, mon, tue, wed, thu, fri, sat, comment, alarmtype, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)");
		stmt.run(hour, minute, days[0], days[1], days[2], days[3], days[4], days[5], days[6], '', 'sunrise', 1).finalize(cb());
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

//Updates an alarm based on ID
exports.updateAlarm = function(id, field, value, cb){
	db.serialize(function(){
		db.exec("UPDATE alarms SET "+field+"='"+value+"' WHERE id='"+id+"'", function(err, row){
			if(!err){
				cb(true);
			} else { console.log(err); }
		});
	});
};

//Checks database for alarm. Makes a very specific query
exports.checkForAlarm = function(hour, minute, day, cb){
	db.serialize(function(){
		db.get("SELECT * FROM alarms WHERE hour = ? AND minute = ? AND "+day+" = ? AND enabled = ?", hour, minute, 1, 1, function(err, row){
			if(row !== undefined)
			{
				console.log('TRIGGERED:' + hour + minute + ' - ' + day);
				//Some logic here. If no other day is set, disable alarm.
				cb(row['alarmtype']);
			} else {
				//console.log('Checked:' + hour + minute + ' - ' + day);
			}
		});
	});


};//-End