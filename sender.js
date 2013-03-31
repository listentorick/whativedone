var nodemailer = require("nodemailer");

//module.exports.createTransport = function(){
  //  return new Sender();
//};

function Sender(configuration) {
	this._smtpTransport = nodemailer.createTransport("SMTP",
	  configuration
	);	
};

Sender.prototype.send = function(to, subject, text, cb) {
	this._smtpTransport.sendMail({
	   from: "WhatIDidToday2013@gmail.com", // sender address
	   to: to, // comma separated list of receivers
	   subject: subject, // Subject line
	   text: text // plaintext body
	}, cb);

};
module.exports = Sender;
