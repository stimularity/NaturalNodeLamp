	var leds;
	var animate = false;
	var drops;

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'colorwheel'){
			animate = !animate;
			leds.fillColor(0,0,0); //Clear LEDS
			animateTimer();
			console.log('Timer Set for ' +value+ ' minutes');
			drops = [leds.count()];
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
			id:'timerset',
			value:0
		}];
	};

	exports.init = function(parentleds){
		leds = parentleds; //Init the leds.
	};

	counter = 0;

	function timerStep(){
		if(counter == 60){
			//Drop light, reset counter
		}
		counter++;
		for(i=0; i<drops.length; i++){
			drops[i] = next;
			if(drops[i] == 1){
				drops[i] = 0; //Erease Current pixel
				next = 1; //Turn on next light;
			}
		}
	}//


	function animateTimer(){
		if(animate){
			timerStep();
			setTimeout(animateTimer, 15); //~60 FPS
		}
	}





