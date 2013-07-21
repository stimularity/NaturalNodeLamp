	var tinycolor = require('tinycolor2');
	var sun = require('suncalc'); //To calculate sundown time

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	function randomColor(){
		var color = tinycolor.random().toRgb(); //have tinycolor generate a random color
		leds.fillColor(color['r'],color['b'],color['g']); //Set strip that color.
	}

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons.push({
			title:'Random',
			type:'button',
			id:'random',
			value:0,
			alarm:true //This action may be executed as an alarm.
		});
		buttons.push({
			title:'Darken',
			type:'button',
			id:'darken',
			value:0
		});
		buttons.push({
			title:'Lighten',
			type:'button',
			id:'lighten',
			value:0
		});
		buttons.push({
			title:'Saturate',
			type:'button',
			id:'saturate',
			value:0
		});

		return buttons;
	};

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'random'){ randomColor(); }

		if(id == 'blue'){leds.fillColor(leds.r(), leds.g(), value);}
		if(id == 'red'){leds.fillColor(value, leds.g(), leds.b()); }
		if(id == 'green'){leds.fillColor(leds.r(), value, leds.b());}

		if(id =='on'){ on(); }
		if(id =='off'){ leds.fillColor(0, 0, 0); }

		if(id == 'darken'){ darken(); }
		if(id == 'lighten'){ lighten(); }
		if(id == 'saturate'){ saturate(); }
	};

	/**
	 * On - Smart on button.
	 * Button determines time of day
	 * Then sets perfect brightness.
	 */
	function on(){
		leds.fillColor(255,255,255);
	}

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