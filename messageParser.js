var events = require('events');
var util = require('util');
var MongoTask = require("./models/task");
var MongoUser = require("./models/user");
var MongoNudge = require("./models/nudge");
var logger = require("./logger");

/**
* MessageParser splits a email message body into tasks
*/
function MessageParser(taskParser, nudger) {
	this._taskParser = taskParser;
	this._nudger = nudger;
};

MessageParser.prototype.__proto__ = events.EventEmitter.prototype;

MessageParser.prototype.parse = function(message) {
	var self = this;
	var nudgeId = this.extractNudgeId(message);
	if(nudgeId) {
		this._nudger.findById(nudgeId, function(err, nudge){
			if(!err && nudge) {
				var body = message.text;
				var taskBodies = body.match(/[^\r\n]+/g);
				for(var i=0; i<taskBodies.length;i++){	
					self.constructTask(nudge, taskBodies[i]);
				}
			} else {
				logger.info("Nudge id not found in the database!");
			}
		});
	} else {
		logger.info("Nudge id not found in nudge response message!");
	}
};


MessageParser.prototype.extractNudgeId = function(message) {

	var subject = message.subject;
	
	//does the subject contain a guid - if so assume its a nudge id
	//4edd40c86762e0fb12000003
	var checkForNudgeId = new RegExp("[0-9a-fA-F]{24}");
	
	var match = checkForNudgeId.exec(subject);
	
	if(match && match[0]) {
		return match[0];	
	} else {
		return null;
	}
},

		

MessageParser.prototype.constructTask = function(nudge, taskDescription){
	  
	var task = new MongoTask({userId:nudge.userId, text: taskDescription});
	var self = this;
	//should this method be called enrich??
	this._taskParser.parse(task, function(err, result) {
	
		if(err) {
			console.log(err);
		} else {
			//persist the task - not sure we should be doing this here?
			task.save(function(err, result) {
			
				if(err) {
					callback(err);
				}
			
				self.emit('task', task); 
			});
		}
	});
	  
};


module.exports = MessageParser;