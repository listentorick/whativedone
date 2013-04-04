var express = require('express');
var routes = require('./routes');
var http = require('http');
var Sender = require('./sender');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var Nudger = require("./nudger");
var CronJob = require("cron").CronJob;
var logger = require("./logger");

var IMAPReader = require("./IMAPReader");
var IMAPMessageToNudgeResponseAdapter = require("./IMAPMessageToNudgeResponseAdapter");
var NudgeResponseGateway = require("./nudgeResponseGateway");
var MessageParser = require("./messageParser");
var TaskParser = require("./taskParser");
var MongoUser = require("./models/user");
var NudgeResponseTaskExtractor = require("./nudgeResponseTaskExtractor");


app.configure(function(){
  app.set('port', process.env.PORT || 3030);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




var configuration = require("./config/development");

var reader;
var messageParser;
var taskParser;
var nudger;
var sender;

mongoose.connection.on('open', function (err) {

	logger.info("connected");
	
	var sender = new Sender(configuration.sender);
	var taskParser = new TaskParser();
	var nudger = new Nudger(sender);
	var reader = new IMAPReader(configuration.reader);
	var messageToNudgeResponseAdapter = new IMAPMessageToNudgeResponseAdapter();
	var nudgeResponseTaskExtractor = new NudgeResponseTaskExtractor(taskParser);
	
	var nudgeResponseGateway = new NudgeResponseGateway(reader, nudger, messageToNudgeResponseAdapter, nudgeResponseTaskExtractor);
	

	var job = new CronJob('00 00 16 * * 1-5', function(){
		// Runs every weekday (Monday through Friday)
		// at 4pm. It does not run on Saturday
		// or Sunday.
		console.log("starting cron job");
		nudgeResponseGateway.read();
	
	
	  }, function () {
		// This function is executed when the job stops
	  }, 
	  true /* Start the job right now */,
	  //timeZone /* Time zone of this job. */
	  "Europe/London"
	);
	
	job.start();
	
	
	
	nudgeResponseGateway.on("nudgeResponse", function(nudgeResponse) {
	
		//a new nudgeresponse has entered the system...
		logger.info("new nudge response");
	});
	
	nudgeResponseGateway.on("task", function(tasl) {
		//a new nudgeresponse has entered the system...
		logger.info("new task");
	});

	 //to be called by a cron job...

	//reader.on("message", function(message) {
		//messageParser.parse(message);
	//});

//	messageParser.on("task", function(task) {
		//seems like a good time to save?
	//	console.log(JSON.stringify(task));
	//});
	
	
	app.get('/read', function(req,res) {
		nudgeResponseGateway.read();
		
		res.end("reading.."); 
	});
	
	app.get('/nudge', function(req,res) {
		logger.info("handling request to nudge");
		MongoUser.find(
			{},
			function(err, docs) {
			if (!err){ 
				logger.info("found " + docs.length + " users");
			  
				for(var i=0; i<docs.length; i++ ){
					nudger.nudge(docs[i], function(err, result) {});
				}
			  r
			} else { throw err;}

			}
		);
		
		res.end("nudging.."); 
	});

});
	
mongoose.connection.on('error', function (err) {
	logger.info("wooop" + JSON.stringify(err,null, 4));
});

mongoose.connect(configuration.database);






//db.on("error", function(err) {
	
	//logger.info("got an error");

	//logger.info(err);
//});



//transport.send("rick.walsh@gmail.com", "test", "woop", function(error, response) {
//	console.log(error);
//});



//load all the users..







//new MongoUser({name: "rick", email:"rick.walsh@gmail.com"}).save();

//something needs to tell the nudger to nudge (via cron)
//something needs to find the users required to be nudged



/*
MongoUser.find(
		{},
		function(err, docs) {
		console.log(docs.length);
		if (!err){ 
		  
		  for(var i=0; i<docs.length; i++ ){
			
		//	nudger.nudge(docs[i], function(err, result) {
			
			
			//});
		  }
		  
		} else { throw err;}

		}
    );
*/
//*/






//another object will check the message box via IMAP on a schedule (node-cron) - could emit a 'response' event? 
//needs to extract the nudge id from the message. From this we determine the user.

//another object will parse the message and create the completed tasks for the user(responseParser?)

//This will be scheduled, although a user visiting their homepage could force processing...

//some other code which does scheduling.
//this determines the users we need to send a message to.

//some other object which:
//generates the message/nudge
//creates a messsage id
//stores the message id against a user in the data base
//sends the message to the user


//

// Bootstrap our mongoose models
//var models_path = __dirname + '/models'
//fs.readdirSync(models_path).forEach(function (file) {
  //require(models_path+'/'+file)
//}//) 




