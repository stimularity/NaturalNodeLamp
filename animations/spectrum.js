	//Only two accessable functions
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'spectrum'){
			leds.fillColor(0,0,0); //Turn off color wheel
			animate = !animate;
			loopMathmos();
			console.log('Mothmosing!!!');
		}
		if(id == 'off'){ animate = false; }
	};

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	var start=0, end=0, offset=0, color=0, r=0, b=0, g=0;
	function mathmos2(){
		var correction = 1;
		if(end === 0){ end = leds.pixelcount-correction; }
		size = end - start;
		offset += 1;
		if(offset == 384){ offset = 0; }
		//for (var led = 0; led < leds.pixelcount-correction; led++) {
			color = (1 * (384/(leds.pixelcount-correction)) + offset) % 384;
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
			leds.fillColor(Math.ceil(r), Math.ceil(g), Math.ceil(b));
		//}//Optimize by moving out of Forloop 
	}//

	function loopMathmos(){
		if(animate){
			mathmos2();
			setTimeout(loopMathmos, 100);
		}
	}