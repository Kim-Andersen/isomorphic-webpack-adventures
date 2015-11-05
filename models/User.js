var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
import _ from 'lodash';

// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  username_lower: { // Used for indexed, case-insensitive username lookups.
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 4,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 30
  },
  name: {
    type: String,
    unique: false,
    required: false
  },
  created: { 
    type: Date, 
    default: Date.now, 
    required: true
  },
  updatedAt: {
    type: Date, 
    required: false
  }/*,
  loginProvider: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    unique: true,
    required: false
  },
  linkedinId: {
    type: String,
    unique: true,
    required: false
  },
  twitterId: {
    type: String,
    unique: true,
    required: false
  },
  oauthAccessToken: {
    type: String,
    unique: true,
    required: false
  },
  oauthRefreshToken: {
    type: String,
    unique: true,
    required: false
  }*/
});

UserSchema.methods.toJSON = function() {
  var user = this.toObject();
  user['id'] = user._id;
  return _.pick(user, 'id', 'username', 'email', 'name', 'created');
}

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  if(user.email) {
    user.email = user.email.toLowerCase();
  }

  if(user.username){
    user.username_lower = user.username.toLowerCase();
  }

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateApiToken = function(apiTokenSecret){
  var token = jwt.sign(this, apiTokenSecret, {
    expiresIn: 60*60*24 // seconds
  });

  return token;
};

module.exports = mongoose.model('User', UserSchema);