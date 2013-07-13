	var leds;
	var animate = false;

	//Only two accessable functions
	exports.interface = function(id, value){
		if(id == 'colorwheel'){
			animate = !animate;
			leds.fillColor(0,0,0); //Turn off color wheel
			loopy();
			console.log('Wheel of Color keeps on turning.');
		}
		if(id == 'off'){ animate = false; }
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons[0] = {
			title:'Activate Colorwheel',
			type:'button', //Display class button
			id:'colorwheel', //Pass sunrise to interface. 
			value:0, //No variation, only 30 min sunrise
			alarm:true //This action may be executed as an alarm.
		};
		return buttons;
	};

	exports.init = function(parentleds){
		leds = parentleds;
	};

	var start=0, end=0, offset=0, color=0, r=0, b=0, g=0, correction=1;
	function colorWheel(){
		if(end === 0){ end = leds.pixelcount-correction; }
		size = end - start;
		offset += 1;
		if(offset == 384){ offset = 0; }
		for (var led = 0; led < leds.pixelcount-correction; led++) {
			color = (led * (384/(leds.pixelcount-correction)) + offset) % 384;
			if(color < 128){
				r = 127 - color % 128;
				g = color % 128;
				b = 0;
			}
			else if(color < 256){
				g = 127 - color % 128;
				b = color % 128;
				r = 0;
			} else {
				b = 127 - color % 128;
				r = color % 128;
				g = 0;
			}
			leds.setPixel(start + led, Math.ceil(r), Math.ceil(g), Math.ceil(b));
		}//Optimize by moving out of Forloop 
	}//


	function loopy(){
		if(animate){
			colorWheel();
			setTimeout(loopy, 15);
		}
	}





