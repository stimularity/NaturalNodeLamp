	/*
	 * Sunrise Module
	 * Gradually gets brighter over 
	 * a 30 minute time period.
	 */

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons.push({
			title:'Start Sunrise',
			type:'button', //Display class button
			id:'sunrise', //Pass sunrise to interface. 
			value:0, //No variation, only 30 min sunrise 
			alarm:true //This action may be executed as an alarm.
		});
		return buttons;
	};

	//Animation options.
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'sunrise'){
			leds.fillColor(0,0,0); //Zero out strip
			animate = !animate;
			counter = 0;
			runAnimation();
			console.log('Making the Sun Rise at ' + currentTime());
		}
		if(id == 'off'){ animate = false; } //off is a reserved word.
	};

	//Array of preset colors to fade through. 
	// var phase = [ //Steps - 2000
	// 	{r:0, g:0, b:0, numsteps: 1500}, //Pitch Black
	// 	{r:0, g:25, b:50, numsteps: 1500}, //Dark Blue Morning
	// 	{r:80, g:0, b:100, numsteps: 3000}, //Pink Sunrise
	// 	{r:250, g:225, b:0 } //Blinding Yellow Sunbeams 
	// ];

	//Array of preset colors to fade through. 
	var phase = [ //Steps - 2000
		{r:0, g:0, b:0, numsteps: 1500}, //Pitch Black
		{r:50, g:0, b:0, numsteps: 1500}, //Red Burning Skies
		{r:0, g:100, b:0, numsteps: 3000}, //Kinda green, I guess
		{r:0, g:200, b:255 } //Bright Blue
	];

	var i, tempcounter, rdelta, gdelta, bdelta, counter=0;
	function sunrise(){
		i = 0;
		tempcounter = 0;
		//Determine current phase.
		while(tempcounter <= counter){
			tempcounter+=phase[i]['numsteps'];
			i++;
		}
		//When phase is complete, exit program.
		if(i >= phase.length || animate === false){
			animate = false;
			console.log('Sunrise Complete at ' +  currentTime());
			return;
		}
		//Calculate change in current LED to next LED
		rdelta = (phase[i]['r'] - phase[i-1]['r'])/(phase[i-1]['numsteps']);
		gdelta = (phase[i]['g'] - phase[i-1]['g'])/(phase[i-1]['numsteps']);
		bdelta = (phase[i]['b'] - phase[i-1]['b'])/(phase[i-1]['numsteps']);
		//Send Colors to LED strip
		leds.fillColor(
			leds.r() + rdelta,
			leds.g() + gdelta,
			leds.b() + bdelta
		);
		counter++;
	}


	//60 times to reach maximum brightness
	function runAnimation(){
			if(animate){
			sunrise();
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