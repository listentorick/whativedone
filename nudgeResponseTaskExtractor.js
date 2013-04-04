var events = require('events');
var util = require('util');
var MongoTask = require("./models/task");
var MongoUser = require("./models/user");
var MongoNudge = require("./models/nudge");
var logger = require("./logger");

/**
* MessageParser splits a email message body into tasks
*/
function NudgeResponseTaskExtractor(taskParser) {
	this._taskParser = taskParser;
};

NudgeResponseTaskExtractor.prototype.__proto__ = events.EventEmitter.prototype;

NudgeResponseTaskExtractor.prototype.extract = function(nudgeResponse, callback) {
	var count = 0;
	var body = nudgeResponse.text;
	var taskBodies = body.match(/[^\r\n]+/g);
	for(var i=0; i<taskBodies.length;i++){	
		self.constructTask(nudgeResponse, taskBodies[i], function() {
			count++;
			if(count == taskBodies.length) {
				callback();
			}
		});
	}		
};

NudgeResponseTaskExtractor.prototype.constructTask = function(nudgeResponse, taskDescription){
	  
	var task = new MongoTask({userId:nudgeResponse.userId, text: taskDescription});
	this._taskParser.parse(task, function(err, result) {
	
		if(err) {
			logger.error("Task not parsed.");
		} else {
		
			task.save(function(err){
				if(!err) { 
					self.emit('task', task); 
					callback(null, task);
				} else {
					logger.error("Task not persisted.");
					callback(err, task);
				}
			});
		}
	});
	  
};


module.exports = NudgeResponseTaskExtractor;