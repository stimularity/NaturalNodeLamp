//var Time = require('../Time'); //Global Timer and time function.
//var timer = new Time(); // create an instance of the Time class

this.suite1 = {
    'test one': function (test) {
        test.ok(true, 'everythings ok');
        setTimeout(function () {
            test.done();
        }, 10);
    },
    'apples and oranges': function (test) {
        test.equal('apples', 'oranges', 'comparing apples and oranges');
        test.done();
    }
};