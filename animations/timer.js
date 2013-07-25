	var leds;
	var animate = false;
	var runtime = 1; //Number of minutes for the timer to run.

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'timer'){
			animate = !animate;
			leds.fillColor(0,0,0); //Clear the strip of LEDS.
			console.log('Timer Set for ' +runtime+ ' minutes at ' + currentTime());

			//Init timer
			for(i=0; i<leds.count(); i++){
				drops[i] = {r:0, b:0, g:0}; //Set array of empty colors.
			}
			if(runtime == 0){ runtime = 1; } //Prevent a 0 value thing.
			counter = 0;
			seconds = 0;
			animateTimer();
		}
		if(id == 'timersetruntime'){ //Set timer value.
			runtime = value;
			console.log('Timer run time set to ' + value);
		}
		if(id == 'off'){ animate = false; }
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		return [{
			title:'Start Timer', //Start Timer 
			type:'button',
			id:'timer',
			value:0
		}, {
			title:'Set Time', //Set Timer
			type:'slider',
			id:'timersetruntime',
			value:0
		}];
	};

	exports.init = function(parentleds){
		leds = parentleds; //Init the leds.
	};

	var tinycolor = require('tinycolor2');

	counter = 0;
	seconds = 0; //Number of seconds the timer has been running.
	drops = [];
	function timerStep(){
		counter++;
		drops.shift(); //Remove first value

		//Add dot or enpty space. 
		if(counter == 10){ //Every second, adda new drop to the strip.
			counter = 0;
			seconds++;

			//Push a drop onto the strip.
			drops.push({r:255, b:20, g:20}); //Push to end of array
		} else {
			drops.push({r:0, b:0, g:0}); //Push new empty pixel onto end.
		}

		//Calculate % complete
		fillnum = leds.count() * (seconds/(runtime*60)); //Number of leds to fill with complete color.
		for(i=0; i<drops.length; i++){
			if(i < fillnum){ //Number of pixels to fill.
				if(drops[i]['r'] == 255) //If current pixel is in complete, brighten it.
				{
					drops[i] = {r:140, b:80, g:0};
				}
				if(drops[i]['r'] === 0){ //If it is not set, make it purp
					drops[i] = {r:80, b:80, g:0};
				}
			}
		}

		for(i=0; i<leds.count(); i++){ //Animate Drops on the strip.
			leds.setPixel(i, drops[i]['r'], drops[i]['g'], drops[i]['b']); //Set pixel
		}

		if(seconds/60 == runtime){ //When the time runs out.
			//Pulse green or some shit.
			animate = false; //Turn off animation.
			leds.fillColor(0, 100, 20);
			console.log('Timer complete at ' + currentTime());
		}

	}//

	function animateTimer(){
		if(animate){
			timerStep();
			setTimeout(animateTimer, 50);
		}
	}

	/*
		1000 ms / second
		1 run  /  50 ms
		20 runs (50ms per run) = 1000ms
	*/

	function currentTime(){
		var ctime = new Date();
		var hours = ctime.getHours();
		var minutes = ctime.getMinutes();
		var seconds = ctime.getSeconds();

		if(seconds < 10){ //Add 0 if seconds is 1 char
			seconds = '0' + seconds;
		}
		if(minutes < 10){ //add 0 if minutes is 1 char
			minutes = "0" + minutes;
		}
		var suffix = "AM";
		if(hours >= 12){ //Display AM or PM and convert military time.
			suffix = "PM";
			hours = hours - 12;
		}
		if(hours === 0){ //Convert militarp time.
			hours = 12;
		}
		return hours + ":" + minutes + "."+seconds+" " + suffix;
	}





