this.basicTest = {
	setUp: function () {
		this._openStdin = process.openStdin;
		this._log = console.log;
		this._exit = process.exit;

		this.leds = require(__dirname + '/../../Leds'); //No interface, base of all library functions.
		this.leds.fillColor(0,0,0); //Zero out leds for 

		this.basic = require(__dirname + "/../../animations/basic");
		this.basic.init(leds);

		var ev = this.ev = new events.EventEmitter();
		process.openStdin = function () { return ev; };
	},
	'Test On': function(test){
		this.basic.interface('on');
		console.log('Yup stuff');
		test.equal('oranges', 'oranges', 'comparing oranges and oranges');
		test.done();
	},
	'Test Off': function(test){
		test.equal('oranges', 'oranges', 'comparing oranges and oranges');
		test.done();
	}
};