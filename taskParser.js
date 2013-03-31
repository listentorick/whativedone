var events = require('events');
var util = require('util');
var parser = require("./grammar");

/**
* MessageParser doesnt know about where the message came from. 
*/
function TaskParser() {
};

TaskParser.prototype.__proto__ = events.EventEmitter.prototype;

TaskParser.prototype.parse = function(task, callback) {
	try {
		var result = parser.parse(task.text);
		
		//adapt the result.....
		task.tags = result.tags
		task.primaryTag = result.primaryTag;
		task.time = result.time;
		callback(null,task);
	} catch(e) {
		callback(e);
	}
};

module.exports = TaskParser;