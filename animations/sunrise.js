	/*
	 * Sunrise Module
	 * Gradually gets brighter over 
	 * a 30 minute time period.
	 */

	var leds;
	exports.init = function(parentleds){
		leds = parentleds;
	};

	//Animation options.
	var animate = false;
	exports.interface = function(id, value){
		if(id == 'sunrise'){
			leds.fillColor(0,0,0); //Zero out strip
			animate = !animate;
			runAnimation();
			console.log('Making the Sun Rise');
		}
		if(id == 'off'){ animate = false; }
	};

	// 0  > Fade to 
	// 4  > Blue	- 0, 50, 100
	// 18 > Pink	- 170, 0, 220 
	// 36 > Yellow	- 255, 255, 0
	var counter = 0;
	var phase2 = [
		{r:0, g:0, b:0, numsteps: 1000},
		{r:0, g:50, b:100, numsteps: 1000},
		{r:170, g:0, b:220, numsteps: 1000},
		{r:255, g:255, b:0, numsteps: 1000}
	];
	var phase = [ //Steps - 1667
		{r:0, g:0, b:0, numsteps: 1000},
		{r:0, g:25, b:50, numsteps: 1000},
		{r:85, g:0, b:110, numsteps: 1000},
		{r:200, g:200, b:0, numsteps: 1000}
	];
	var steps = 1000;
	var phase1 = [
		{r:0, g:0, b:0, numsteps: steps},
		{r:255, g:0, b:0, numsteps: steps},
		{r:0, g:255, b:0, numsteps: steps},
		{r:0, g:0, b:255, numsteps: steps},
		{r:255, g:0, b:255, numsteps: steps},
		{r:255, g:255, b:0, numsteps: steps},
		{r:0, g:255, b:255, numsteps: steps},
		{r:255, g:255, b:0, numsteps: steps},
		{r:0, g:0, b:255, numsteps: steps},
		{r:255, g:255, b:255, numsteps: steps},
		{r:0, g:0, b:0, numsteps: steps}
	];
	function sunrise(){
		var i = 0;
		var tempcounter = 0;
		while(tempcounter <= counter){
			tempcounter+=phase[i]['numsteps'];
			i++;
		}
		//console.log(i);
		if(i >= phase.length){
			animate = false;
			return;
		}
		var rdelta = (phase[i]['r'] - phase[i-1]['r'])/(phase[i-1]['numsteps']);
		var gdelta = (phase[i]['g'] - phase[i-1]['g'])/(phase[i-1]['numsteps']);
		var bdelta = (phase[i]['b'] - phase[i-1]['b'])/(phase[i-1]['numsteps']);
		leds.fillColor(
			leds.r() + rdelta,
			leds.g() + gdelta,
			leds.b() + bdelta
		);
		//Set the led strip
		counter++;
	}


	//60 times to reach maximum brightness
	function runAnimation(){
			if(animate){
			sunrise();
			setTimeout(runAnimation, 833); //Brightens every 30,000 milliseconds
		}
	}