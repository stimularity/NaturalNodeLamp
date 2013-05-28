	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'fire'){
			randomColor();
		}
	};

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Write this shit! 