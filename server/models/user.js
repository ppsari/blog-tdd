const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/util');

let userSchema = new Schema({
  password: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /.{10,20}/.test(val)},
      message: `{PATH}'s length must be between 10 and 20 char`
    }
  },
  username: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /[a-z]{3,20}/gi.test(val) },
      message: `{PATH}'s length must be between 3 and 20 char`
    },
    unique: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  articleList: [{type:Schema.Types.ObjectId, ref:'Article'}]
});

userSchema.pre('save', function(next) {
  this._doc.password = helper.hashPassword(this._doc.password);
  next();
});

let User = mongoose.model('User',userSchema);
module.exports = User;