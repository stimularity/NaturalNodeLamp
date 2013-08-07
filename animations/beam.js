	var leds;
	var animate = false;

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'beam'){
			if(value === 0){ value = 1; }
			cycles = value;
			total_cycles = 0;
			location = 0;
			up = true;
			down = false;
			color = tinycolor.random().toRgb(); //Set initial Color

			animate = !animate;
			leds.fillColor(0,0,0); //Clear the strip of LEDS.
			console.log('Shoot Beam. ' + value + ' zips.');

			animateBeam();
		}
		if(id == 'off'){ animate = false; }
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		return [{
			title:'Beam', //Start beam 
			type:'button',
			id:'beam',
			value:0
		},
		{
			title:'Beam 100', //Start beam 
			type:'button',
			id:'beam',
			value:10
		}];
	};

	exports.init = function(parentleds){
		leds = parentleds; //Init the leds.
	};

	var tinycolor = require('tinycolor2');

	cycles = 0; //Number of times beam cycels
	total_cycles = 0; //Number of runs
	location = 0;
	up = true;
	down = false;
	color = 0;
	tail_length = 4;
	function timerStep(){
		leds.empty();
		leds.setPixel(location, color['r'], color['b'], color['g']); //Light correct light.

		if(up){
			for(j=1; j<tail_length+1; j++){
				if(location-j >= 0)
				leds.setPixel(location-j, Math.floor(color['r']/j), Math.floor(color['b']/j), Math.floor(color['g']/j));
			}
		}
		if(down){
			for(j=tail_length; j>0; j--){
				if(location+j <= leds.count()){
					leds.setPixel(location+j, Math.floor(color['r']/j), Math.floor(color['b']/j), Math.floor(color['g']/j));
				}
			}
		}
			
		
		if(up){
			location++;
		}
		if(down){
			location--;
		}

		if(location >= leds.count()){
			up = false;
			down = true;
			total_cycles++;
		}
		if(location <= 0){
			up = true;
			down = false;
		}

		if(cycles == total_cycles){
			animate = false;
			leds.fillColor(0,0,0); //Turn off
		}
		

	}//

	function animateBeam(){
		if(animate){
			timerStep();
			setTimeout(animateBeam, 10);
		}
	}

	/*
		1000 ms / second
		1 run  /  50 ms
		20 runs (50ms per run) = 1000ms
	*/





