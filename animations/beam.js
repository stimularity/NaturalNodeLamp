	//Only two accessable functions
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'beam'){
			animate = !animate;
			leds.fillColor(0,0,0); //Turn off color wheel
			//console.log('Beaming ' + leds.r() + ', ' + leds.g() + ', ' + leds.g());
			loopBeam();
		}
	};

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	var currentlight = 10;
	var direction = true;
	function beam(){
		leds.fillColor(0,0,0);
		leds.setPixel(currentlight, leds.r(), leds.g(), leds.b());
		if(direction){
			currentlight++;
		} else {
			currentlight--;
		}
		if(currentlight == leds.pixelcount-2){
			direction = !direction;
		}
		if(currentlight === 0){
			direction = !direction;
		}
	}

	function loopBeam(){
		if(animate){
			beam();
			setTimeout(loopBeam, 50);
		}
	}