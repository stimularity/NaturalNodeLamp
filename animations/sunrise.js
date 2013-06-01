	/*
	 * Sunrise Module
	 * Gradually gets brighter over 
	 * a 30 minute time period.
	 */


	//Animation options.
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'sunrise'){
			leds.fillColor(0,0,0); //Zero out strip
			animate = !animate;
			animate();
			console.log('Mothmosing!!!');
		}
		if(id == 'off'){ animate = false; }
	};

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	function sunrise(){
		//Brighten leds 
	}



	function animate(){
			if(animate){
			sunrise();
			setTimeout(animate, 30); //Brightens every 30 seconds
		}
	}