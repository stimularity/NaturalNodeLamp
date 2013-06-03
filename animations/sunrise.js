	/*
	 * Sunrise Module
	 * Gradually gets brighter over 
	 * a 30 minute time period.
	 */

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Animation options.
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'sunrise'){
			leds.fillColor(0,0,0); //Zero out strip
			animate = !animate;
			runAnimation();
			console.log('Making the Sun Rise at ' + currentTime());
		}
		if(id == 'off'){ animate = false; }
	};

	//Array of preset colors to fade through. 
	var phase = [ //Steps - 2000
		{r:0, g:0, b:0, numsteps: 500}, //Pitch Black
		{r:0, g:25, b:50, numsteps: 500}, //Dark Blue Morning
		{r:80, g:0, b:100, numsteps: 1000}, //Pink Sunrise
		{r:250, g:225, b:0, numsteps: 2000} //Blinding Yellow Sunbeams 
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
		if(i >= phase.length){
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
			setTimeout(runAnimation, 730); //Brightens every 30,000 milliseconds 
		}
	}
	// 833 - 41 Minutes 11:26 to 12:07
	// 125 - 4  Minutes
	// 625 - 21 Minutes 4:32 to 4:53
	// 730 - 4:58 to 5:23 

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
		return hours + ":" + minutes + " " + seconds;
	}