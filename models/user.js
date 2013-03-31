var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
    userId: {type : String, default : '', trim : true}
  , name: {type : String}
  , createdAt  : {type : Date, default : Date.now}
  , email: {type: String, default : null, trim : true}
})

module.exports = mongoose.model('User', UserSchema);