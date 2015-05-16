var fs = require("fs");
var sqlite3 = require('sqlite3');//.verbose();
var db = new sqlite3.Database(':memory:');//('./Alarms.db');
var saved_alarms_file_path = "/home/pi/NaturalNodeLamp/alarms.conf";

//Create Default database if you don't got one. 
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER NOT NULL, minute INTEGER NOT NULL, sun INTEGER, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, comment TEXT, alarmtype TEXT, enabled INTEGER)");
	//db.run("CREATE TABLE IF NOT EXISTS ringing (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER NOT NULL, minute INTEGER NOT NULL, sun INTEGER, mon INTEGER, tue INTEGER, wed INTEGER, thu INTEGER, fri INTEGER, sat INTEGER, comment TEXT, alarmtype TEXT, enabled INTEGER)");
	//db.run("INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('22', '30', '1', '1', '1', '1', '1', '0', '0', 'Hunt Werewolfs', 'sunrise', 1)");
	//db.run("INSERT INTO alarms (hour, minute, mon, tue, wed, thu, fri, sat, sun, comment) VALUES ('09', '25', '0', '0', '0', '0', '0', '1', '1', 'Stash Cheese in mouth.', 'colorwheel', 0)");
	fs.exists(saved_alarms_file_path, function(exists) {
	    if (exists) {
	        var saved_alarms = JSON.parse(fs.readFileSync(saved_alarms_file_path, 'utf8'));
	        console.log('Loading Alarms from file');
        	db.serialize(function(){
				var stmt = db.prepare("INSERT INTO alarms (hour, minute, sun, mon, tue, wed, thu, fri, sat, comment, alarmtype, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)");
				for(a in saved_alarms){
					stmt.run(saved_alarms[a].hour, saved_alarms[a].minute, saved_alarms[a].sun, saved_alarms[a].mon, saved_alarms[a].tue, saved_alarms[a].wed, saved_alarms[a].thu, saved_alarms[a].fri, saved_alarms[a].sat, saved_alarms[a].comment, saved_alarms[a].alarmtype, saved_alarms[a].enabled);
				}
				
			});
	    }
	});
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
	days = [1,1,1,1,1,1,1]; //Set all days to active. 
	//days[day] = 1; //Set alarm to active on current day. 
	db.serialize(function(){
		var stmt = db.prepare("INSERT INTO alarms (hour, minute, sun, mon, tue, wed, thu, fri, sat, comment, alarmtype, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)");
		stmt.run(hour, minute, days[0], days[1], days[2], days[3], days[4], days[5], days[6], '', 'sunrise', 1).finalize(cb());
	});

	writeAlarmsToFile();

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

	writeAlarmsToFile();
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
	writeAlarmsToFile();
};

function writeAlarmsToFile(){
	//Write New alarm to file.
	db.serialize(function(){
		db.all("SELECT * FROM alarms", function(err, row){
			fs.writeFile(saved_alarms_file_path, JSON.stringify(row), function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("Alarms Saved.");
			});
		});
	});
}

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