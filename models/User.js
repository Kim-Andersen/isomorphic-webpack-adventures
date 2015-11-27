import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { API_TOKEN_SECRET } from '../authConfig'

let Schema = mongoose.Schema

// Define our user schema
var userSchema = new mongoose.Schema({
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
    required: true
  },
  name: {
    type: String,
    unique: false,
    required: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true
  },
  updatedAt: {
    type: Date, 
    required: false
  },
  twitter: {
    id: { type: String, required: false },
    token: { type: String, required: false }, /* Not required so user can unlink account */
    tokenSecret: { type: String, required: false },
    displayName: { type: String, required: false },
    username: { type: String, required: false },
    photo: { type: String, required: false }
  },
  latestStories : [{ type: Schema.Types.ObjectId, ref: 'Story' }],
  profile: {
    bio: { type: String, required: false },
    name: { type: String, required: false },
    location: { type: String, required: false }
  },
  contact: {
    email: {type: String, required: false},
    phone: {type: String, required: false}
  }
});

userSchema.methods.toJSON = function() {
  var user = this.toObject();
  user['id'] = user._id;
  return _.pick(user, 
    'id',
    'username', 
    'email', 
    'name', 
    'created', 
    'twitter',
    'latestStories',
    'profile',
    'contact'
  );
}

// Execute before each user.save() call
userSchema.pre('save', function(callback) {
  var user = this;

  user.updatedAt = new Date();

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

userSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateApiToken = function(){
  var token = jwt.sign(this, API_TOKEN_SECRET, {
    expiresIn: 60*60*24 // seconds
  });

  return token;
};

userSchema.statics.getProfileByUsername = function(username, callback){
  if(!_.isString(username) || username.length === 0) throw Error('Invalid param <username>.');
  if(!_.isFunction(callback)) throw Error('Invalid param <callback>.');

  let User = this

  User
    .findOne({username_lower: username.toLowerCase()})
    .populate([{
      path: 'latestStories', 
      select: 'id abstract hasBody bodyExcerpt createdAt tags'
    }])
    .exec(function(err, user){
      console.log('user', user);
      callback(err, user)
    })
}

export default mongoose.model('User', userSchema)