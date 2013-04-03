var util = require('util');
var NudgeResponse = require("./models/nudgeResponse");
var logger = require("./logger");

function IMAPMessageToNudgeResponseAdapter() {

};

IMAPMessageToNudgeResponseAdapter.prototype.adapt = function(message) {
	var self = this;
	var nudgeId = this.extractNudgeId(message);
	var text = message.text;
	return new NudgeResponse({nudgeId: nudgeId, text: text});
};

IMAPMessageToNudgeResponseAdapter.prototype.extractNudgeId = function(message) {

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
};

module.exports = IMAPMessageToNudgeResponseAdapter;