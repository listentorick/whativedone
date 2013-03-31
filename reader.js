
var events = require('events');
var Imap = require('imap'),
    inspect = require('util').inspect;
	
/**
* Reads the inbox and finds emails which are responses to the 
*/
function Reader(nudger, messageParser,configuration) {
	this._nudger = nudger;
	this._messageParser = messageParser;
	
	this._imap = new Imap({
		user: configuration.user,
		password: configuration.password,
		host: configuration.host,
		port: configuration.port,
		secure: configuration.secure
    });
	
};

Reader.prototype.__proto__ = events.EventEmitter.prototype;

/**
* reads any available nudge response
*/
Reader.prototype.read = function(callback) {
	console.log("rick1");
	var self = this;
	self._imap.connect(function(err) {
		console.log("rick2");
		if (err) callback(err);
		self._imap.openBox('INBOX', true, function(err, mailbox) {
			self._imap.search([ 'UNSEEN', ['SUBJECT', 'WhatIDone'] ], function(err, results) {
		
				if (err) callback(err);
				self._imap.fetch(results, { 
					headers: ['from', 'body', 'subject', 'date'],
					cb: function(fetch) {
					  fetch.on('message', function(msg) {
						var headers;
						var body;
						//console.log('Saw message no. ' + msg.seqno);
						msg.on('headers', function(hdrs) {
						  //console.log('Headers for no. ' + msg.seqno + ': ' + JSON.stringify(hdrs));
						  headers = hdrs;
						});
						
						msg.on('data', function(chunk) {
							body += chunk.toString('utf8');
						  });
						
						msg.on('end', function() {

							//load the nudge associated with the message...
							self._nudger.findById(nudgeId, function(err, result) {
								//parse the message body - this will create and persist tasks (and emit them);
								self._messageParser.parse(result, body);
							});
							
						});
					  });
					}
				  }, function(err) {
					if (err) throw err;
					console.log('Done fetching all messages!');
					self._imap.logout();
				  }
				)
			});
		});

	});
};

module.exports = Reader;
