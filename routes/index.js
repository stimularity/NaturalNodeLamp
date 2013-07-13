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
			if(String(data[i]['minute']).length == 1){ data[i]['minute'] = '0' + data[i]['minute']; } //Prepend zero to things like 10:0
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
	res.render('alarmentry'); //Simply render template
};

/**
 * Generates a set of alarm buttons.
 * Each animation module exports gui elements.
 * If the gui element has the alarm attribute, a single command that functions on the strip,
 * then it is possible to set that action as an alarm. 
 */
exports.alarmbuttons = function(req, res){
	var animations = res.app.settings['animations']; //Get animations library.
	var buttons = []; //Array of buttons that gets sent to the browser.

	for(var key in animations){
		if(typeof(animations[key].getInterface) !== "undefined"){ //Make sure module exports GUI elements

			for(var i=0; i<animations[key].getInterface().length; i++){

				if(animations[key].getInterface()[i].alarm){ //If the button has the alarm attribute.
					buttons.push(animations[key].getInterface()[i]); //Push button to gui
				}
			}
		}
	}

	res.render('alarmbuttons', {
		title: 'Fucking alarm buttons and shit',
		buttons: buttons
	});
};

//Renders a little pannel that allows for alarm selection
exports.graphical = function(req, res){
	var animations = res.app.settings['animations'];
	var guielements = [];
	var counter = 1;
	//Init for misc buttons
	guielements[0] = {};
	guielements[0]['category'] = 'misc';
	guielements[0]['gui'] = [];

	for(var key in animations){ //For each animation module.
		if(typeof(animations[key].getInterface) !== "undefined"){ //Check for buttons
			//console.log(key + ' has ' + animations[key].getInterface().length + ' buttons.');

			if(animations[key].getInterface().length > 1){ //If the module has an interface
				index = guielements.length; 
				guielements[index] = {}; //Make new dictionary for current Counter
				guielements[index]['category'] = key; //Set KEY 
				guielements[index]['gui'] = animations[key].getInterface(); //Set gui with [{},{},{}]
			} else {
				guielements[0]['gui'].push(animations[key].getInterface()[0]);
			}
			counter++;
		}
	}

	res.render('graphical',{
		title:'Some Gui shit going on here.',
		gui: guielements
	});
};