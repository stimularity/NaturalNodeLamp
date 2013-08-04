var Time = require(__dirname + '/../Time'); //Global Timer and time function.
var timer = new Time(); // create an instance of the Time class

this.suite1 = {
    'test one': function (test) {
        test.ok(true, 'everythings ok');
        setTimeout(function () {
            test.done();
        }, 10);
    },
    'apples and oranges': function (test) {
        test.equal('oranges', 'oranges', 'comparing oranges and oranges');
        test.equal(on(new Date("July 27, 2013 1:00:00") ), 'red', 'Testing Midnight to sunrise');
        test.equal(on(new Date("July 27, 2013 11:00:00") ), 'white', 'Testing sunrise to noon');
        test.equal(on(new Date("July 27, 2013 15:00:00") ), 'aqua', 'Testing noon to four');
        test.equal(on(new Date("July 27, 2013 17:00:00") ), 'orange', 'Testing four to sunset');
        test.equal(on(new Date("July 27, 2013 22:00:00") ), 'red', 'Testing sunset to 12');

        test.equal(on(new Date("July 27, 2013 00:00:00") ), 'red', 'Testing sunset to 12');
        test.done();
    }
};

var sun = require('suncalc'); //To calculate sundown time
    var lat = 40; //Lattitude 
    var lon = -105; //Longitude 
    //@todo move lat an lon to a sigle location

/**
     * On - Smart on button.
     * Button determines time of day
     * Then sets perfect brightness.
     */
    function on(in_date){

        //Init times
        ctime = in_date;
        solartimes = new sun.getTimes(ctime, lat, lon); //Solar times

        //Things we need for calculations
        h = ctime.getHours();
        sunrise = solartimes.sunrise.getHours();
        sunset = solartimes.sunset.getHours();
        set_color = 'none'; //For testing.

        //0 and sunrise - RED
        if(h >= 0 && h <= sunrise){
            //leds.fillColor(200,0,0);
            set_color = 'red';
        }

        //sunrise and noon - white
        if(h >= sunrise && h <= 12){
            //leds.fillColor(255,255,255);
            set_color = 'white';
        }

        //noon and 4 - aqua
        if(h >= 12 && h <= 16){
            //leds.fillColor(120,255,255);
            set_color = 'aqua';
        }

        //4 and sunset - orange
        if(h >= 16 && h <= sunset){
            //leds.fillColor(255,150,0);
            set_color = 'orange';
        }

        //sunset and 0 - red
        if(h >= sunset && h <= 24){
            //leds.fillColor(240,0,0);
            set_color = 'red';
        }
        return set_color;
    }