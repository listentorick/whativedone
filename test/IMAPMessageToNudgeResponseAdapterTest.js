
var IMAPMessageToNudgeResponseAdapter = require('../IMAPMessageToNudgeResponseAdapter');
var  assert = require('assert');

describe('NudgeResponse creation ', function(){

	var adapter = new IMAPMessageToNudgeResponseAdapter()

	describe('adapt()', function() {
		var nudgeResponse = adapter.adapt({subject: "Re: Nudge!! 4edd40c86762e0fb12000003", text: "#support"});
		
		it('should return a nudgeResponse with a nudgeId', function(){
			assert.equal(nudgeResponse.nudgeId, "4edd40c86762e0fb12000003");
		})
		it('should return a nudgeResponse with text', function(){
			assert.equal(nudgeResponse.text,"#support");
		})
	})
});