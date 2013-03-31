
var vows = require('vows'),
    assert = require('assert');

var TaskParser = require('../taskParser');
var MongoTask = require("../models/task");

vows.describe('Task Parsing with ').addBatch({

    'A TaskParser': {
        topic: new TaskParser(),
		'when parsing a task without a primary tag' : {
			topic: function (parser) {
				parser.parse(new MongoTask({text: "task without tag at the start"}),this.callback);
            },
			'should return an error': function(err, result) {
				assert.isNotNull(err);
			}
		},
		'when parsing a task with 1 tag ': {
            topic: function (parser) {
				parser.parse(new MongoTask({text: "#support"}),this.callback);
            },
			'should not throw an exception':function (err, result) {
				assert.isNull(err);
			},
			'should have a primaryTag ':function (err, result) {
				assert.equal(result.primaryTag,"support", "Tag added");
			},
			'should add 1 tag':function (err, result) {
				assert.equal(result.tags.length,1, "Tag added");
			},
			'should add 1 tag with the correct name':function (err, result) {
				assert.equal(result.tags[0],"support", "Correct tag added");
			}			
        },
		
        'when parsing a task with 1 tag and a time': {
            topic: function (parser) {
				parser.parse(new MongoTask({text: "#support +5"}),this.callback);
            },
			'should not throw an exception':function (err, result) {
				assert.isNull(err);
			},
			'should add 1 tag':function (err, result) {
				assert.equal(result.tags.length,1, "Tag added");
			},
			'should have a primaryTag ':function (err, result) {
				assert.equal(result.primaryTag,"support", "Tag added");
			},
			'should add 1 tag with the correct name':function (err, result) {
				assert.equal(result.tags[0],"support", "Correct tag added");
			},
			'should add 1 time':function (err, result) {
				assert.equal(result.tags.length,1, "Time added");
			}				
        },
		
		'when parsing a task with 2 tags ': {
            topic: function (parser) {
				parser.parse(new MongoTask({text: "#support #helpdesk"}),this.callback);
            },
			'should not throw an exception':function (err, result) {
				assert.isNull(err);
			},
			'should add 2 tag':function (err, result) {
				assert.equal(result.tags.length,2, "2 Tags added");
			},
			'should have a primaryTag ':function (err, result) {
				assert.equal(result.primaryTag,"support", "Tag added");
			},
			'should add 2 tags with the correct name':function (err, result) {
				assert.equal(result.tags[0],"support", "Correct tag added");
				assert.equal(result.tags[1],"helpdesk", "Correct tag added");
			}			
        }
	}
}).export(module); // Export the Suite