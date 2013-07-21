	//-- Required functions.
	var leds;
	var animate = false;
	var activationid = 'randomdance'; //Unique ID that causes this function to start.

	//Only one animation
	exports.interface = function(id, value){
		if(id == activationid){
			animate = !animate;
			leds.fillColor(0,0,0); //Turn off color wheel
			superRandomDancePartySetup();
			animateLoop();
			console.log('Starting a super random dance party.');
		}
		if(id == 'off'){ animate = false; }
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons[0] = {
			title:'Super Random',
			type:'button', //Display class button
			id:activationid, //Pass sunrise to interface. 
			value:0,
			alarm:true //This action may be executed as an alarm.
		};
		return buttons;
	};

	exports.init = function(parentleds){
		leds = parentleds;
	};
	//-- Required Functions
	var tinycolor = require('tinycolor2');

	var colors = [];
	var fill = {r:200, b:0, g:0};
	var counter = 0;
	//Random colors for everyone.
	function superRandomDanceParty(){

		//Set strip.
		for(i=0; i<leds.count(); i++){
			current = colors[i];
			if(Math.random() < 0.05) //Chance of random color.
			{
				current = tinycolor.random().toRgb();
			}
			else if(Math.random() < 0.05) //Chance of random color.
			{
				current = {r:255, b:255, g:255}; //Pure White.
			}
			else if(Math.random() < 0.05) //Chance of random color.
			{
				current = {r:0, b:0, g:0}; //Pure black.
			}
			leds.setPixel(i, current['r'], current['g'], current['b']); //Set pixel
		}

		colors.shift(); //Remove first pixel from array.
		if(Math.random() < 0.3) //Chance of random color.
		{
			colors.push(tinycolor.random().toRgb()); //Add new random color to end of array.
		}
		else
		{
			if(counter%20 === 0){
				counter = 0;
				fill = tinycolor.random().toRgb();
			}
			colors.push(fill);
			counter++;
		}

	}

	//Init array of random colors to modify.
	function superRandomDancePartySetup(){
		for(i=0; i<leds.count(); i++){
			//Grab random color
			colors[i] = tinycolor.random().toRgb(); //Put in random color array. 
		}
	}

	function animateLoop(){
		if(animate){
			superRandomDanceParty();
			setTimeout(animateLoop, 50);
		}
	}





