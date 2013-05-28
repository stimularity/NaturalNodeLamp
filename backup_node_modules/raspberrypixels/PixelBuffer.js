var color	= require('tinycolor2'),
	Pixel 	= require('./Pixel')

/**
 * Representation of a pixel strand in the form of a raw buffer
 * @param {number} num_pixels Number of pixels in the strand
 */
function PixelBuffer(num_pixels){
	this.buffer = new Buffer(num_pixels * 3) // Internal buffer, each pixel is a group of three values
	this.readBuffer = new Buffer(num_pixels * 3)

	this.buffer.fill(0)
	this.readBuffer.fill(0)
}

/**
 * Returns the buffer associated with the object
 * @return {Buffer} Buffer representing the pixel strand's raw data
 */
PixelBuffer.prototype.get = function(){
	return this.buffer
}

/**
 * Get the Pixel object at the specified index
 * @param  {number} i Index of the Pixel to retrieve
 * @return {Pixel}    Pixel object at the specified index
 */
PixelBuffer.prototype.getPixel = function(i){
	return new Pixel(this.buffer[i * 3],
					 this.buffer[i * 3 + 1],
					 this.buffer[i * 3 + 2])
}

/**
 * Set the RGB value of the pixel at the specified index
 * @param {number} i Index of the Pixel to set
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 */
PixelBuffer.prototype.setRGB = function(i, r, g, b){
	this.buffer[i * 3] = r
	this.buffer[i * 3 + 1] = g
	this.buffer[i * 3 + 2] = b
}

/**
 * Set the HSL value of the pixel at the specified index
 * @param {number} i Index of the Pixel to set
 * @param {number} h Hue value
 * @param {number} s Saturation value
 * @param {number} l Lightness value
 */
PixelBuffer.prototype.setHSL = function(i, h, s, l){
	var c = color({
		h: h,
		s: s,
		l: l
	}).toRgb()

	this.setRGB(
		i,

		c.r,
		c.g,
		c.b
	)
}

/**
 * Set the RGB values at the specified index through a Pixel object
 * @param {number} i     Index of the Pixel to set
 * @param {Pixel} pixel  Pixel to set at the specified index
 */
PixelBuffer.prototype.setPixel = function(i, pixel){
	var rgb = pixel.getRGB()

	this.buffer[i * 3] = rgb.r
	this.buffer[i * 3 + 1] = rgb.g
	this.buffer[i * 3 + 2] = rgb.b
}

/**
 * Fill the entire pixel strand with a specific RGB color
 * @param  {number} r Red value
 * @param  {number} g Green value
 * @param  {number} b Blue value
 */
PixelBuffer.prototype.fillRGB = function(r, g, b){
	this.fillRangeRGB(0, this.buffer.length / 3, r, g, b)
}

/**
 * Fill a specific range of pixels with a specific color. The other pixels are
 * not modified.
 * @param  {number} start First pixel to change the color of
 * @param  {number} end   Last pixel to change the color of
 * @param  {number} r     Red value
 * @param  {number} g     Green value
 * @param  {number} b     Blue value
 */
PixelBuffer.prototype.fillRangeRGB = function(start, end, r, g, b){
	if(start < 0 || start > this.buffer.length / 3
		|| end < 0 || end < start || end > this.buffer.length / 3){
		return; // You can't fill the pixels in that range
	}

	for(var i = start * 3; i < end * 3; i += 3){
		this.buffer[i] = r
		this.buffer[i + 1] = g
		this.buffer[i + 2] = b
	}
}

/**
 * Multiply the RGB values provided onto the pixel buffer
 * @param  {number} r Red value
 * @param  {number} g Green value
 * @param  {number} b Blue value
 */
PixelBuffer.prototype.multiplyRGB = function(r, g, b){
	for(var i = 0; i < this.buffer.length; i += 3){
		this.buffer[i] = this.buffer[i] * r / 255
		this.buffer[i + 1] = this.buffer[i + 1] * g / 255
		this.buffer[i + 2] = this.buffer[i + 2] * b / 255
	}
}

/**
 * Turn the entire pixel strand off
 */
PixelBuffer.prototype.blank = function(){
	this.fillRGB(0, 0, 0)
}

module.exports = PixelBuffer