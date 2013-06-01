	var tinycolor = require('tinycolor2');

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	function randomColor(){
		var color = tinycolor.random().toRgb(); //have tinycolor generate a random color
		leds.fillColor(color['r'],color['b'],color['g']); //Set strip that color.
	}

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'random'){ randomColor(); }

		if(id == 'blue'){leds.fillColor(leds.r(), leds.g(), value);}
		if(id == 'red'){leds.fillColor(value, leds.g(), leds.b()); }
		if(id == 'green'){leds.fillColor(leds.r(), value, leds.b());}

		if(id =='on'){ leds.fillColor(240, 240, 240); }
		if(id =='off'){ leds.fillColor(0, 0, 0); }

		if(id == 'darken'){ darken(); }
		if(id == 'lighten'){ lighten(); }
		if(id == 'saturate'){ saturate(); }
	};

	function lighten(){
		var color = tinycolor.lighten(leds.getCurrentColor()).toRgb();
		leds.fillColor(color['r'],color['b'],color['g']); //Set strip that color.
	}

	function darken(){
		var color = tinycolor.darken(leds.getCurrentColor()).toRgb();
		leds.fillColor(color['r'],color['b'],color['g']); //Set strip that color.
	}

	function saturate(){
		var color = tinycolor.saturate(leds.getCurrentColor()).toRgb();
		leds.fillColor(color['r'],color['b'],color['g']); //Set strip that color.
	}