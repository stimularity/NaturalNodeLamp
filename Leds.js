//Library to control LED strip with node.js and node-spi


	//Required Libraries
	var SPI = require('spi'); //SPI for low level stuff

	this.pixelcount = 25; //Global Var, number of pixels in strip
	var strip = new SPI.Spi('/dev/spidev0.0', function(){}); //Init SPI
	var buff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	var emptybuff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	emptybuff.fill(0x0);

	var maximumbrightness = 100;
	var red = 0;
	var green = 0;
	var blue = 0;

	//Gamma Array, adjusted for LED strip. 
	var gamma = new Buffer(256); //256 Bytes
	for (var i = 0; i < 256; i++) {
		gamma[i] = 0x80 | Math.floor(Math.pow(parseFloat(i) / 255.0, 2.5) * 127.0 + 0.5);
	}


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

	exports.setPixel = function(led, r, g, b){
		//console.log('Pixel #' + led +  ' to '+ r + ', ' + b + ', ' + g);
		buff[led*3    ] = gamma[g];
		buff[led*3 + 1] = gamma[r];
		buff[led*3 + 2] = gamma[b];
		update(r, g, b);
	};

	function update(r, g, b){
		if(r >= 0) red = r;
		if(g >= 0) green = g;
		if(b >= 0) blue = b;
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

	exports.getCurrentColor = function(){
		return 'rgb('+red+','+green+','+blue+')';
	};

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





