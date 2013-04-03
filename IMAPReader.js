
var events = require('events');
var Imap = require('imap'),
    inspect = require('util').inspect;
var MailParser = require("mailparser").MailParser;
var logger = require("./logger");
	
/**
* Emits objects in the form {header: {},body:""} 
*/
function IMAPReader(configuration) {
	this._imap = new Imap({
		user: configuration.user,
		password: configuration.password,
		host: configuration.host,
		port: configuration.port,
		secure: configuration.secure
    });
	
};

IMAPReader.prototype.__proto__ = events.EventEmitter.prototype;


IMAPReader.prototype.markMessageAsRead = function(message,callback) {
};


/**
* reads any available nudge response
*/
IMAPReader.prototype.read = function(callback) {
	var self = this;
	self._imap.connect(function(err) {
		if (err) callback(err);
		self._imap.openBox('INBOX', true, function(err, mailbox) {
		
			logger.info("Connected to INBOX");
		
			self._imap.search([ 'UNSEEN', ['SUBJECT', 'nudge'] ], function(err, results) {
		
				if (err) callback(err);
				
				self._imap.fetch(results, { 

					headers: { parse: false },
					body: true,

					cb: function(fetch) {
					  fetch.on('message', function(msg) {
					  
						logger.info("Found message");
					  
					
						var mailParser = new MailParser();
						
						mailParser.on('end', function(mailObj){
							self.emit("message", mailObj);
						});
						
						msg.on('data', function(chunk) {
							mailParser.write(chunk.toString());
						});
						
						msg.on('end', function() {
							mailParser.end();
						});
					  });
					}
				  }, function(err) {
					if (err) throw err;
					self._imap.logout();
				  }
				)
			});
		});

	});
};

module.exports = IMAPReader;
