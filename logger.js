var winston = require('winston');
require('winston-papertrail').Papertrail;

var logger = new (winston.Logger)({
  transports: [
	new (winston.transports.Papertrail)({ host: 'logs.papertrailapp.com',port: '52777', handleExceptions: true}),
    new (winston.transports.Console)({ json: false, timestamp: true, handleExceptions: true}),
    //new winston.transports.File({ filename: __dirname + '/debug.log', json: false }),
	
  ]//,
  //exceptionHandlers: [
   // new (winston.transports.Console)({ json: false, timestamp: true }),
    //new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  //],
  exitOnError: false
});

module.exports = logger;