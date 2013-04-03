var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var NudgeSchema = new Schema({
    nudgeId: {type : String, default : '', trim : true}
  , userId: {type : String}
  , createdAt  : {type : Date, default : Date.now}
  , handledAt : {type : Date, default : null}
 ,  handled  : {type : Boolean}
})

module.exports = mongoose.model('Nudge', NudgeSchema);