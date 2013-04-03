var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var NudgeResponseSchema = new Schema({
    nudgeId: {type : String, default : '', trim : true},
	text: {type : String, default : '', trim : true}
})

module.exports = mongoose.model('NudgeResponse', NudgeResponseSchema);