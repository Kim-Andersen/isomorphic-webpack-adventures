import mongoose from 'mongoose'
import _ from 'lodash'
import User from './User'

var schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 140
  },
  type: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  }
});

schema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
});

schema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

export default mongoose.model('Activity', schema)