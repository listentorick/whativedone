var MongoNudge = require("./models/nudge");
var logger = require("./logger");
//var mongoUser = require("./models/user");

//module.exports.createNudger = function(sender){
//	return new Nudger(sender);
//}



function Nudger(sender) {
	this._sender = sender;
};

Nudger.prototype.findById = function(nudgeId, callback) {
	MongoNudge.findById(nudgeId, callback) 
}

Nudger.prototype.nudge = function(user, callback) {
	var self = this;
	//create the nudge record in the db
	//once complete, send the associated email
	var mongoNudge = new MongoNudge({ userId: user.id });

	mongoNudge.save(function (err, mongoNudge) {
		if (err) {
			callback(err);
		} else {
			//console.log("saved" + mongoNudge.id);
			
			logger.info("Nudge saved");
			
			self._sender.send(user.email, "nudge!! " + mongoNudge.id, "woop", function(error, response) {
				if(err) {
					callback(err);
				} else {
					logger.info("Nudge sent to " + user.email);
					callback(null);
				}
			});
		}
	});

};

module.exports = Nudger;

