var events = require('events');
var logger = require("./logger");
	
/**
* Responsible for generating Nudge Responses.
* NudgeResponses mean we have a copy of the original nudge message body
*/
function NudgeResponseGateway(reader, nudger, nudgeResponseAdapter, nudgeResponseTaskExtractor) {
	this._imapReader = reader;	
	this._nudger = nudger;
	var self = this;
	this._nudgeResponseAdapter = nudgeResponseAdapter;
	this._nudgeResponseTaskExtractor = nudgeResponseTaskExtractor;
	
	nudgeResponseTaskExtractor.on("task", function(task) {
		self.emit("task", task);
	});
	
	//handle the messages emitted by the imap reader
	this._imapReader.on("message", function(message) {
		var nudgeResponse = self._nudgeResponseAdapter.adapt(message);
		
		//is the nudgeid valid?
		self._nudger.findById(nudgeResponse.nudgeId, function(err, nudge){
			if(!err && nudge) {
				logger.info("Nudge found in the database!");
				
				if(!nudge.handled) {
					nudgeResponse.save(function(err) {
						if(!err) {
							
							//now lets extract the tasks
							nudgeResponseTaskExtractor.extract(nudgeResponse, function(err) {
							
								if(!err) {
									logger.info("Extracted tasks from nudge response.");
									nudge.handled = true;
									nudge.handledAt = new Date();
									nudge.save(function(err) {
									
										if(!err) {
											self._imapReader.markMessageAsRead(message); //fire and forget.
											logger.info("new nudgeResponse");
											self.emit("nudgeResponse", nudgeResponse);
										} else {
											logger.error(err);
										}
									
									});
								}
							
							});
						} else {
							logger.error(err);
						}
					});
				} else {
					logger.info("Nudge already handled!");
				}
				
			} else {
				logger.info("Nudge id not found in the database!");
			}	
		});
	});

};

NudgeResponseGateway.prototype.__proto__ = events.EventEmitter.prototype;

NudgeResponseGateway.prototype.read = function() {
	this._imapReader.read(); //to be called by a cron job..
};

module.exports = NudgeResponseGateway;
