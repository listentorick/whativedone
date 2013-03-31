var fs = require('fs');
var vows = require('vows');


var mongoose = require('mongoose');

function setUp(callback) {
	mongoose.connect('mongodb://localhost/whatidone_test');
	mongoose.connection.on('connected', function (err) {
		callback();
	});
	
	mongoose.connection.on('error', function (err) {
		console.log(err);
	});
}

function tearDown() {
	mongoose.connection.close();
}

var testSuites = [];

function runTests(callback) {
	console.log("running tests");
	var tests_path = __dirname + '/test'
	fs.readdirSync(tests_path).forEach(function (file) {
		var testSuite = require(tests_path+'/'+file)
		testSuites.push(testSuite);
	});
	  
	var completedTestsCount = 0;
	for(var i=0; i<testSuites.length;i++){
		var ts = testSuites[i];
		for(var p in ts) {
			if(ts[p].run) {
				ts[p].run({}, function() {
					completedTestsCount++;
					if(completedTestsCount==testSuites.length) {
						callback();
					}
				});
			}	
		}
	}
}

setUp(function(){ 
	runTests(tearDown);
});


