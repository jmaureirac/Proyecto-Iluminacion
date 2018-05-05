'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  created_at: String,
  updated_at: String 
});

module.exports = mongoose.model('User', UserSchema);
