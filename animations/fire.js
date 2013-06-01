	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'fire'){
			randomColor();
		}
		if(id == 'off'){ animate = false; }
	};

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Write this shit! 