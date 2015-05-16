	/*
	 * Attempt to simulate a fire
	 */

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons.push({
			title:'Fire',
			type:'button', //Display class button
			style:'fire-button', //Styles for the button
			id:'fire', //Pass sunrise to interface. 
			value:0, //No variation, only 30 min sunrise 
			alarm:true //This action may be executed as an alarm.
		});
		return buttons;
	};

	//Animation options.
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'fire'){
			leds.fillColor(0,0,0); //Zero out strip
			animate = !animate;
			counter = 0;
			console.log('Making da fire burn at ' + currentTime());

			//Init pulse array
			for(i=0; i<leds.count(); i++){
				pulse[i] = {
					'r':255,
					'g':30,
					'b':0
				};
			}
			runAnimation(); //Run animation after init.
		}
		if(id == 'off'){ animate = false; } //off is a reserved word.
	};

	var spot = {
		0:0,
		1:0,
		2:0
	};

	var spots = []; //A collection of spots

	var pulse = []; //Arrray of fade between orange and yellow.
	var background = 0;
	var pulse_steps = 10; //Number of steps before new pulse background is set.

	function burnFire(){
		//Adjust background flames color
		background = Math.floor(Math.random() * (170 - 60 + 1)) + 60;
		console.log(background);
		for(i=0; i<leds.count(); i++){
			pulse[i]['g'] = background;
		}

		for(i=0; i<leds.count(); i++){
			leds.setPixel(i, pulse[i]['r'], pulse[i]['g'], pulse[i]['b']); //Set pixel
		}

	}

	function newSpot(){
		return {
			'r':255,
			'g':( Math.random() * (170 - 60) + 170 ), //Random number between 60 and 170
			'b':0
		};	
	}


	//60 times to reach maximum brightness
	function runAnimation(){
		if(animate){
			burnFire();
			setTimeout(runAnimation, 300); //Brightens every 30,000 milliseconds 
		}
	}


	//Functions for testing.
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