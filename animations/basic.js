	var tinycolor = require('tinycolor2');
	var sun = require('suncalc'); //To calculate sundown time
	var lat = 40; //Lattitude 
	var lon = -105; //Longitude 
	//@todo move lat an lon to a sigle location

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

		//Solid Color buttons with special styles
		buttons.push({
			title:'Red',
			type:'button',
			id:'solidred',
			style:'btn-danger',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Green',
			type:'button',
			id:'solidgreen',
			style:'btn-success',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Blue',
			type:'button',
			id:'solidblue',
			style:'btn-primary',
			alarm:true,
			value:0
		});
		//
		buttons.push({
			title:'Yellow',
			type:'button',
			id:'solidyellow',
			style:'btn-yellow',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Orange',
			type:'button',
			id:'solidorange',
			style:'btn-orange',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Cyan',
			type:'button',
			id:'solidcyan',
			style:'btn-cyan',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Purple',
			type:'button',
			id:'solidpurple',
			style:'btn-purple',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'Pink',
			type:'button',
			id:'solidpink',
			style:'btn-pink',
			alarm:true,
			value:0
		});
		buttons.push({
			title:'White',
			type:'button',
			id:'solidwhite',
			style:'btn-white',
			alarm:true,
			value:0
		});

		//roygbiv
		//Red, Orange, Yellow, Green, Blue, Ingigo, Violet
		return buttons;
	};

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'random'){ randomColor(); }

		if(id == 'blue'){leds.fillColor(leds.r(), leds.g(), value);}
		if(id == 'red'){leds.fillColor(value, leds.g(), leds.b()); }
		if(id == 'green'){leds.fillColor(leds.r(), value, leds.b());}

		if(id =='on'){ on(new Date()); }
		if(id =='off'){ leds.fillColor(0, 0, 0); }

		if(id == 'darken'){ darken(); }
		if(id == 'lighten'){ lighten(); }
		if(id == 'saturate'){ saturate(); }

		if(id == 'solidred'){ leds.fillColor(255, 0, 0); }
		if(id == 'solidgreen'){ leds.fillColor(0, 255, 0); }
		if(id == 'solidblue'){ leds.fillColor(0, 0, 255); }
		//More
		if(id == 'solidyellow'){ leds.fillColor(255, 255, 0); }
		if(id == 'solidcyan'){ leds.fillColor(0, 255, 255); }
		if(id == 'solidpurple'){ leds.fillColor(255, 0, 255); }
		//Even more
		if(id == 'solidorange'){ leds.fillColor(255, 128, 0); }
		if(id == 'solidpink'){ leds.fillColor(255, 0, 128); }
		if(id == 'solidwhite'){ leds.fillColor(255, 255, 255); }
	};

	/**
	 * On - Smart on button.
	 * Button determines time of day
	 * Then sets perfect brightness.
	 */
	function on(in_date){

		//Init times
		ctime = in_date;
		solartimes = new sun.getTimes(ctime, lat, lon); //Solar times

		//Things we need for calculations
		h = ctime.getHours();
		sunrise = solartimes.sunrise.getHours();
		sunset = solartimes.sunset.getHours();
		set_color = 'none'; //For testing.

		//0 and sunrise - RED
		if(h >= 0 && h <= sunrise){
			leds.fillColor(200,0,0);
			set_color = 'red';
		}

		//sunrise and noon - white
		if(h >= sunrise && h <= 12){
			leds.fillColor(255,255,255);
			set_color = 'white';
		}

		//noon and 4 - aqua
		if(h >= 12 && h <= 16){
			leds.fillColor(120,255,255);
			set_color = 'aqua';
		}

		//4 and sunset - orange
		if(h >= 16 && h <= sunset){
			leds.fillColor(255,150,0);
			set_color = 'orange';
		}

		//sunset and 0 - red
		if(h >= sunset && h <= 24){
			leds.fillColor(240,0,0);
			set_color = 'red';
		}
		return set_color;
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