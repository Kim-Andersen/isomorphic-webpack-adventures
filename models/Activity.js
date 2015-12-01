import mongoose from 'mongoose'
import _ from 'lodash'
import User from './User'

const LONG_TEXT_SNIPPET_LENGTH = 200

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
  shortText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 140,
    trim: true
  },
  longText: {
    type: String,
    required: false,
    trim: true,
  },
  longTextSnippet: {
    type: String,
    required: false,
    trim: true,
    maxlength: LONG_TEXT_SNIPPET_LENGTH
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

schema.index({
  'text': 'text',
  'textLong': 'text'
})

schema.pre('save', function(next) {
  this.updatedAt = new Date()

  if(this.longText && this.longText.length > LONG_TEXT_SNIPPET_LENGTH) {
    this.longTextSnippet = this.longText.substring(0, LONG_TEXT_SNIPPET_LENGTH)
  }
  next()
});

/*schema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});*/

export default mongoose.model('Activity', schema)