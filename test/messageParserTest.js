
var vows = require('vows'),
    assert = require('assert');

var MessageParser = require('../messageParser');
var MongoTask = require("../models/task");
var TaskParser = require('../taskParser');

function createMockNudger() {
	return mockNudger = {
		findById: function(id, callback) {	
			callback({userId: 1});
		}
	};
}

vows.describe('Task Creation with ').addBatch({

    'A MessageParser': {
        topic: new MessageParser(new TaskParser(), createMockNudger()),
        'when parsing a message containing 1 task': {
            topic: function (parser) {
				var self = this;
				parser.on('task',function(task) {
					self.callback(null, task);
				});
               parser.parse({userId: "1234"},"#support");
            },
			
			'which is a MongoTask ':function (err, result) {
				assert.instanceOf (result, MongoTask);
			},
			
            'the Task':  {
				topic: function(task) {
					return task;
				},
				'should have userId 1234': function(task) {
					assert.equal(task.userId, "1234");
				}
			}
			
        },
	},   
	'Another MessageParser ': {
        topic: new MessageParser(new TaskParser(), createMockNudger()),
		'when parsing a message containing 2 tasks seperated by \r': {
            topic: function (parser) {
				var self = this;
				var count = 0;
				var emittedTasks = [];
				parser.on('task',function(task) {
					emittedTasks.push(task);
					count++;
					if(count==2) {
						self.callback(null, emittedTasks);
					}
				});
               parser.parse({userId: "1234"},"#support\r#note");
            },
            'emits 2 Task objects': function (err, result) {
                assert.equal(2,result.length);
            }
        }
    },
	'Another MessageParser ': {
        topic: new MessageParser(new TaskParser(), createMockNudger()),
		'when parsing a message containing 2 tasks seperated by \n': {
            topic: function (parser) {
				var self = this;
				var count = 0;
				var emittedTasks = [];
				parser.on('task',function(task) {
					emittedTasks.push(task);
					count++;
					if(count==2) {
						self.callback(null, emittedTasks);
					}
				});
               parser.parse({userId: "1234"},"#support\n#note");
            },
            'emits 2 Task objects': function (err, result) {
                assert.equal(2,result.length);
            }
        }
    }
	
}).export(module); // Export the Suite