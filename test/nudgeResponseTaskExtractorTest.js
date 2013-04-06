var assert = require('assert');
var NudgeResponseTaskExtractor = require('../nudgeResponseTaskExtractor');
var TaskParser = require('../taskParser');
var mongoose = require('mongoose');
var MongoTask = require("../models/task");

describe('NudgeResponseTaskExtractor', function(){

	before(function(done){
		mongoose.connect('mongodb://localhost/whatidone_test');
		mongoose.connection.on('connected', function (err) {
			done();
		});
	});

	after(function(done){
		mongoose.connection.close();
		done();
	});
	
	var extractor = new NudgeResponseTaskExtractor(new TaskParser());

	describe('when extracting from a nudgeResponse which contains one task', function() {
		var task;
		var nudgeResponse = {userId: "1234", text: "#support"};
		before(function(done) {
			//perform the extraction and store the result in the variable task.
			extractor.extract(nudgeResponse, function(err, result) {
				task = result[0];
				done();
			});	
		});

		it('should return a task ', function(){
			assert.ok (task instanceof MongoTask);
		});
		
		it('should return a task with a userId of equal to the nudgeResponse userId ', function(){
			assert.equal (task.userId, nudgeResponse.userId);
		});
			
		it('should return a task with a text of equal to the nudgeResponse text', function(){
			assert.equal (task.text, nudgeResponse.text);
		});
		
		it('should persist a task ', function(done){
			MongoTask.findById(task._id,function(err, task) {
				assert.notEqual(task, null);
				done();
			});	
		});
			
	});
	
	describe('when extracting from a nudgeResponse which contains 2 tasks seperated by \n', function() {
		var tasks;
		var nudgeResponse = {userId: "123", text: "#support\n#note"};
		before(function(done) {
			//perform the extraction and store the result in the variable task.
			extractor.extract(nudgeResponse, function(err, result) {
				tasks = result;
				done();
			});	
		});

		it('results in a collection containing 2 tasks ',function () {
			assert.equal (tasks.length, 2);
		})
			
	});
	
	describe('when extracting from a nudgeResponse which contains 2 tasks seperated by \r', function() {
		var tasks;
		var nudgeResponse = {userId: "123", text: "#support\r#note"};
		before(function(done) {
			//perform the extraction and store the result in the variable task.
			extractor.extract(nudgeResponse, function(err, result) {
				tasks = result;
				done();
			});	
		});

		it('results in a collection containing 2 tasks ',function () {
			assert.equal (tasks.length, 2);
		})
			
	});
	
	describe('when extracting from a nudgeResponse which contains 2 tasks seperated by \r', function() {
		
		var task;
		var nudgeResponse = {userId: "123", text: "#support"};
		
		before(function(done) {
			//perform the extraction and store the result in the variable task.
			extractor.on("task", function(result) {
				task = result;
				done();
			});
			extractor.extract(nudgeResponse, function(err, result) {});	
		});

		it('emits a task ',function () {
			assert.ok (task!=null);
		})
			
	})
});