var db = require('./../Database'); //All Database access functions

//This is the index where ALL the magic happens... Most of the magic... Some of the magic...
exports.index = function(req, res){
	res.render('index', { title: 'Innovative Lighting Solutions' });
};

//Renders every alarm in the database. Each alarm is put into a table in View
exports.alarms = function(req, res){
	db.getAlarms(function(data){
		//Convert each time to normal time from military, create ['time']
		for (var i = 0; i < data.length; i++) {
			var ampm = 'AM';
			if(data[i]['hour'] > 12){ data[i]['hour']-=12; ampm = 'PM'; }
			data[i]['time'] = data[i]['hour'] + ':' + data[i]['minute'] + ' ' + ampm;
		}

		res.render('alarms', {
			title: 'We got a bunch of alarms for you. Oh boy do we!',
			alarms: data
		}); //Render alarm data to template.
	});
};

//Renders the alarm input pad. View includes javascript for functionality.
exports.alarmentry = function(req, res){
	res.render('alarmentry');
};

//Renders a little pannel that allows for alarm selection
exports.alarmstyle = function(req, res){
	//get id from req, on click of button, update alarm.
	var buttons = []; //Get an array of bunnons for alarm styles
	res.render('alarmstyle',{
		title:'Select and alarm',
		buttons: buttons
	});
};