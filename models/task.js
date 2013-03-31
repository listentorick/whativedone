var mongoose = require('mongoose')
  , Schema = mongoose.Schema

  //Each line of text in nudge response is converted to a task
var TaskSchema = new Schema({
    userId: {type : String, default : '', trim : true}
  , text: {type : String}
  , createdAt  : {type : Date, default : Date.now}
  , primaryTag: {type : String, default: '', trim : true}
  , time: {type : Number, default: 0}
  , tags: {type : [String]}
})

module.exports = mongoose.model('Task', TaskSchema);