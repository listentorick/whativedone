var assert = require('assert');
var TaskParser = require('../taskParser');
var MongoTask = require("../models/task");

describe('A TaskParser', function(){

	var parser = new TaskParser();

	describe('when parsing a task without a primary tag', function() {
		
		it('should return an error', function(done) {
			parser.parse(new MongoTask({text: "task without tag at the start"}), function(err,result) {
				assert.ok(err!=null);
				done();
			});
		});
	});
	
	describe('when parsing a task with 1 tag', function() {
		var error;
		var task;
		
		before(function(done) {
			parser.parse(new MongoTask({text: "#support"}),function(err,result) {
				error = err;
				task = result;
				done();
			});
		});
		
		it('should not throw an exception', function () {
			assert.ok(error==null);
		});
		
		it('should have a primaryTag ', function () {
			assert.equal(task.primaryTag,"support", "Tag added");
		});
		
		it('should add 1 tag', function () {
			assert.equal(task.tags.length,1, "Tag added");
		});
		
		it('should add 1 tag with the correct name', function () {
			assert.equal(task.tags[0],"support", "Correct tag added");
		});		
	});
	
	describe('when parsing a task with 1 tag and a time',function() {
		var error;
		var task;
		
		before(function(done) {
			parser.parse(new MongoTask({text: "#support +5"}),function(err,result) {
				error = err;
				task = result;
				done();
			});
		});
		
		it('should not throw an exception', function () {
			assert.ok(error==null);
		});
		
		it('should add 1 tag', function () {
			assert.equal(task.tags.length,1, "Tag added");
		});
		
		it('should have a primaryTag', function () {
			assert.equal(task.primaryTag,"support", "Tag added");
		});
		
		it('should add 1 tag with the correct name', function () {
			assert.equal(task.tags[0],"support", "Correct tag added");
		});
			
		it('should add 1 time', function () {
			assert.equal(task.tags.length,1, "Time added");
		})		
		
	});
	
	describe('when parsing a task with 2 tags ', function() {
		var error;
		var task;
		
		before(function(done) {
			parser.parse(new MongoTask({text: "#support #helpdesk"}),function(err,result) {
				error = err;
				task = result;
				done();
			});
		});
	
		it('should not throw an exception', function () {
			assert.ok(error==null);
		});
		
		it('should add 2 tag', function () {
			assert.equal(task.tags.length,2, "2 Tags added");
		});
		
		it('should have a primaryTag', function () {
			assert.equal(task.primaryTag,"support", "Tag added");
		});
		
		it('should add 2 tags with the correct name', function () {
			assert.equal(task.tags[0],"support", "Correct tag added");
			assert.equal(task.tags[1],"helpdesk", "Correct tag added");
		});			
    });
	
	
	
});


