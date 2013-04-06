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
	var self = this;
	var body = nudgeResponse.text;
	var taskBodies = body.match(/[^\r\n]+/g);
	var tasks = [];
	for(var i=0; i<taskBodies.length;i++){			
		self.constructTask(nudgeResponse, taskBodies[i], function(err, result) {
			count++;
			if(!err) {
				tasks.push(result);
			}
			if(count == taskBodies.length) {
				callback(null, tasks);
			}
		});
	}		
};

NudgeResponseTaskExtractor.prototype.constructTask = function(nudgeResponse, taskDescription, callback){
	var self = this;
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
					callback(err, null);
				}
			});
		}
	});
	  
};


module.exports = NudgeResponseTaskExtractor;