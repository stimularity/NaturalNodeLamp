//Library to control LED strip with node.js and node-spi


	//Required Libraries
	var SPI = require('spi'); //SPI for low level stuff

	this.pixelcount = 25; //Global Var, number of pixels in strip
	var strip = new SPI.Spi('/dev/spidev0.0', function(){}); //Init SPI
	var buff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	var emptybuff = new Buffer(this.pixelcount * 3 + 1); //Create Buffer that will eventually be written out
	emptybuff.fill(0x0);

	var red = 0;
	var green = 0;
	var blue = 0;

	//Gamma Array, adjusted for LED strip. 
	var gamma = new Buffer(256); //256 Bytes
	for (var i = 0; i < 256; i++) {
		gamma[i] = 0x80 | Math.floor(Math.pow(parseFloat(i) / 255.0, 2.5) * 127.0 + 0.5);
	}


	exports.fillColor = function(r, g, b){
		setLastColor(r, g, b);
		//console.log('Fill ' + r + ', ' + g + ', ' + b);
		buff.fill(0x0); //Zero out buffer. Mad important.
		for (var led = 0; led < this.pixelcount; led++) {
			buff[led*3    ] = gamma[Math.round(g)];
			buff[led*3 + 1] = gamma[Math.round(r)];
			buff[led*3 + 2] = gamma[Math.round(b)];
		}
		update();
	};

	exports.setPixel = function(led, r, g, b){
		setLastColor(r,g,b);
		//console.log('Pixel #' + led +  ' to '+ r + ', ' + b + ', ' + g);
		buff[led*3    ] = gamma[g];
		buff[led*3 + 1] = gamma[r];
		buff[led*3 + 2] = gamma[b];
		update(); //Push buffer to Strip
	};

	function update(){
		strip.write(buff, emptybuff); //Write in Lovely Colors
	}

	//Will save enpty colors.
	function setLastColor(r, g, b){
		red = r;
		green = g;
		blue = b;
	}//

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





