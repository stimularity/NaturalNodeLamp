var sun = require('suncalc');
console.log('SunCalc testing script.');
var lat = 40;
var lon = -105;

// get today's sunlight times for London
//40.0150° N, 105.2700° W
var times = sun.getTimes(new Date(), lat, lon);
p("Times:", times);

// format sunrise time from the Date object
p("Sunrise String:", fTime(times.sunrise.getHours(), times.sunrise.getMinutes()));

// format sunrise time from the Date object
p("Sunset String:", fTime(times.sunset.getHours(), times.sunset.getMinutes()));

p("Server Time:", currentTime());


console.log('2 AM');
console.log(solarEvents(new Date("July 27, 2013 02:00:00")));
console.log('6 AM');
console.log(solarEvents(new Date("July 27, 2013 06:00:00")));
console.log('8 AM');
console.log(solarEvents(new Date("July 27, 2013 08:00:00")));
console.log('11 AM');
console.log(solarEvents(new Date("July 27, 2013 11:00:00")));
console.log('12 PM');
console.log(solarEvents(new Date("July 27, 2013 12:00:00")));
console.log('5 PM');
console.log(solarEvents(new Date("July 27, 2013 17:00:00")));
console.log('8 PM');
console.log(solarEvents(new Date("July 27, 2013 20:00:00")));
console.log('10 PM');
console.log(solarEvents(new Date("July 27, 2013 22:00:00")));
console.log('12 AM');
console.log(solarEvents(new Date("July 27, 2013 23:59:00")));

function sunsetIn(){
	var solartimes = new sun.getTimes(new Date(), lat, lon); //Solar times
	var ctime = new Date();
	var hours =  solartimes.sunset.getHours() - ctime.getHours();
	var minutes = solartimes.sunset.getMinutes() - ctime.getMinutes();
	console.log('Sunset in ' + hours + ' hours and ' + minutes + ' minutes');
	//console.log('Current Hour: ' + ctime.getHours() + " Sunset Hour: " + solartimes.sunset.getHours());
	//console.log('Current minutes: ' + ctime.getMinutes() + " Sunset minutes: " + solartimes.sunset.getMinutes());
}

function p(t, r){
	console.log(t);
	console.log(r);
}

function fTime(h, m){
	var hours = h;
	var minutes = m;

	if(minutes < 10){
		minutes = "0" + minutes;
	}
	var suffix = "AM";
	if(hours >= 12){
		suffix = "PM";
		hours = hours - 12;
	}
	if(hours === 0){
		hours = 12;
	}
	return hours + ":" + minutes + " " + suffix;
}

function currentTime(){
	var ctime = new Date();
	var hours = ctime.getHours();
	var minutes = ctime.getMinutes();
	var seconds = ctime.getSeconds();

	if(minutes < 10){
		minutes = "0" + minutes;
	}
	var suffix = "AM";
	if(hours >= 12){
		suffix = "PM";
		hours = hours - 12;
	}
	if(hours === 0){
		hours = 12;
	}
	return hours + ":" + minutes + " " + suffix;
}

function solarEvents(in_date){
	solartimes = new sun.getTimes(in_date, lat, lon); //Solar times
	ctime = in_date;
	//Calculate sunrise - Default
	hours =  Math.abs(solartimes.sunrise.getHours() - ctime.getHours());
	minutes = Math.abs(solartimes.sunrise.getMinutes() - ctime.getMinutes());
	description = 'Sunrise in ';

	//Current time is after sunrise AND current time is before midnight
	if(ctime.getHours() > solartimes.sunrise.getHours() && ctime.getHours() <= 24){
		hours =  Math.abs(solartimes.sunset.getHours() - ctime.getHours());
		minutes = Math.abs(solartimes.sunset.getMinutes() - ctime.getMinutes());
		description = 'Sunset in '; //Display when sunset will happen
	}

	//String formatting.
	minutestring = ' minutes';
	if(minutes == 1){ minutestring = ' minute'; }
	hourstring = ' hours and ';
	if(hours == 1){ hourstring = ' hour and '; }
	if(hours === 0){ hourstring = ''; hours = ''; }
	if(ctime.getHours() > solartimes.sunset.getHours()){
		minutestring += ' ago'; description = 'Sunset was '; //Change string if past sunset
	}

	return description + hours + hourstring + minutes + minutestring + '';
}