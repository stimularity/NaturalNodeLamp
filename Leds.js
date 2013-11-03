//Library to control LED strip with node.js and node-spi


	//Required Libraries
	var SPI = require('spi'); //SPI for low level stuff

	this.pixelcount = 51; //Global Var, number of pixels in strip
	var strip = new SPI.Spi('/dev/spidev0.0', function(){}); //Init SPI
	var buff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	var emptybuff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	emptybuff.fill(0x0);

	var maximumbrightness = 100; //TODO finish this.
	var red = 0;
	var green = 0;
	var blue = 0;

	//Gamma Array: create an array of gamma values specifically for this strip. 
	var gamma = new Buffer(256); //256 Bytes
	for (var i = 0; i < 256; i++) {
		gamma[i] = 0x80 | Math.floor(Math.pow(parseFloat(i) / 255.0, 2.5) * 127.0 + 0.5);
	}

	/**
	 * Fills the entire strip with the r,g,b input
	 */
	exports.fillColor = function(r, g, b){
		/* limit = limitBrightness(r, g, b);
		r = limit[0];
		g = limit[1];
		b = limit[2];
		console.log('Fill ' + r + ', ' + g + ', ' + b); */
		buff.fill(0x0); //Zero out buffer. Mad important.
		for (var led = 0; led < this.pixelcount; led++) {
			buff[led*3    ] = gamma[Math.round(g)];
			buff[led*3 + 1] = gamma[Math.round(r)];
			buff[led*3 + 2] = gamma[Math.round(b)];
		}
		update(r, g, b);
	};

	/*
	 * Sets the r,g,b of a single LED.
	 */
	exports.setPixel = function(led, r, g, b){
		//console.log('Pixel #' + led +  ' to '+ r + ', ' + b + ', ' + g);
		buff[led*3    ] = gamma[g];
		buff[led*3 + 1] = gamma[r];
		buff[led*3 + 2] = gamma[b];
		update(r, g, b);
	};

	/*
	 * Sends the current buffer to the LED strip.
	 * This will update the strip to display colors.
	 * And save current input values. 
	 */
	function update(r, g, b){
		if(r >= 0 && r <= 255) red = r;
		if(g >= 0 && g <= 255) green = g;
		if(b >= 0 && b <= 255) blue = b;
		strip.write(buff, emptybuff); //Write in Lovely Colors
	}

	function limitBrightness(r, g, b){
		if(r > maximumbrightness || b > maximumbrightness || g > maximumbrightness){
			//Scale Brightness
			scale = 1;
			brightest = 0;
			colors = [r,g,b];
			for(var key in colors) {
				console.log('Each color ' + colors[key]);
				if(colors[key] > brightest){
					brightest = colors[key];
				}
			}
			scale = (brightest - maximumbrightness)/brightest;
			console.log(brightest + ' is top scaled by ' + scale);
			return [r*scale, g*scale, b*scale];
		} else {
			return [r, g, b];
		}
	}

	/*
	 * Returns the current RGB of led strip.
	 */
	exports.getCurrentColor = function(){
		return 'rgb('+red+','+green+','+blue+')';
	};

	/*
	 * Getters for LED strip information.
	 */
	exports.r = function(){
		return red;
	};
	exports.g = function(){
		return green;
	};
	exports.b = function(){
		return blue;
	};
	exports.count = function(){
		return this.pixelcount;
	};

	exports.empty = function(){
		buff.fill(0x0); //Zero out buffer. Mad important.
		for (var led = 0; led < this.pixelcount; led++) {
			buff[led*3    ] = gamma[0];
			buff[led*3 + 1] = gamma[0];
			buff[led*3 + 2] = gamma[0];
		}
	};





