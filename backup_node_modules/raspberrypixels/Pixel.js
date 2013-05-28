var color	= require('tinycolor2')

/**
 * Representation of a single pixel
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 */
function Pixel(r, g, b){
	this.color = {
		r: r,
		b: b,
		g: g
	}
}

/**
 * Get the RGB value of the pixel
 * @return {object} Object representing the RGB values of the pixel
 */
Pixel.prototype.getRGB = function(){
	return this.color
}

/**
 * Get the HSL value of the pixel
 * @return {number} Object representing the HSL values of the pixel
 */
Pixel.prototype.getHSL = function(){
	return color(this.color)
				.toHsl()
}

module.exports = Pixel;