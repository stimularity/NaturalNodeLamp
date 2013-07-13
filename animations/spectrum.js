	//Only two accessable functions
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'spectrum'){
			//leds.fillColor(0,0,0); //Turn off color wheel
			animate = !animate;
			loopMathmos();
			console.log('Mothmosing!!!');
		}
		if(id == 'off'){ animate = false; }
	};

	//Each button has an ID and a Value
	exports.getInterface = function(){
		buttons = [];
		buttons[0] = {
			title:'Color Spectrum',
			type:'button', //Display class button
			id:'spectrum', //Pass sunrise to interface. 
			value:0, //No variation, only 30 min sunrise
			alarm:true //This action may be executed as an alarm.
		};
		return buttons;
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

	//Array of preset colors to fade through. 
	var steps = 250;
	var phase = [ //Steps - 2000
		{r:255, g:0, b:0, numsteps: steps/2}, //Red
		{r:255, g:0, b:255, numsteps: steps}, //Purple
		{r:0, g:0, b:255, numsteps: steps}, // Blue
		{r:0, g:255, b:255, numsteps: steps}, //Cyan
		{r:0, g:255, b:0, numsteps: steps}, //Green
		{r:255, g:255, b:0, numsteps: steps}, //Yellow
		{r:255, g:0, b:0} //Red
	];

	var i, tempcounter, rdelta, gdelta, bdelta, counter=0;
	function mathmos(){
		if(animate === false){
			return;
		}
		i = 0;
		tempcounter = 0;
		//Determine current phase.
		while(tempcounter <= counter){
			tempcounter+=phase[i]['numsteps'];
			i++;
		}
		if(i == phase.length){
			counter = 0;
			i = 1;
		}
		//Calculate change in current LED to next
		rdelta = (phase[i]['r'] - phase[i-1]['r'])/(phase[i-1]['numsteps']);
		gdelta = (phase[i]['g'] - phase[i-1]['g'])/(phase[i-1]['numsteps']);
		bdelta = (phase[i]['b'] - phase[i-1]['b'])/(phase[i-1]['numsteps']);
		//Send Colors to LED strip
		leds.fillColor(
			leds.r() + rdelta,
			leds.g() + gdelta,
			leds.b() + bdelta
		);
		//When phase is complete, loop program.
		counter++;
	}//

	function loopMathmos(){
		if(animate){
			mathmos();
			setTimeout(loopMathmos, 15);
		}
	}