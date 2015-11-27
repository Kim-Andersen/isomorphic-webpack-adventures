import mongoose from 'mongoose'
import _ from 'lodash';
import { ModelUtils } from './'

// Define our user schema
var storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  abstract: {
    type: String,
    unique: false,
    required: true,
    minlength: 1,
    maxlength: 140,
    trim: true
  },
  body: {
    type: String,
    unique: false,
    required: false,
    maxlength: 4000,
    trim: true,
    index: 'text'
  },
  bodyExcerpt: {
    type: String,
    required: false,
    maxLength: 200
  },
  hasBody: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true,
    index: true
  },
  updatedAt: {
    type: Date, 
    required: false
  },
  tags: {
    type: [String],
    required: false,
    index: true
  },
  isPublished: {
    type: Boolean, 
    default: false,
    required: true,
    index: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
    index: true
  }
});

storySchema.pre('save', function(next) {
  if(this.body && this.body.length > 0){
    this.hasBody = true
    this.bodyExcerpt = this.body.substring(0, 200)
  } else {
    this.hasBody = false
    delete this['bodyExcerpt']
  }

  next()
});

storySchema.post('save', function(story, next){
  ModelUtils.updateLatestStoriesOnUser(story.user, function(err, user){
    if(err) {
      next(err)
    } else {
      next();
    }
  });
})

storySchema.post('remove', function(story, next){
  ModelUtils.updateLatestStoriesOnUser(story.userId, function(err, user){
    if(err) {
      var err = new Error('Failed to update "latestStories" on user after saving story.', err);
      next(err)
    } else {
      next();
    }
  });
})

storySchema.methods.toJSON = function() {
  var story = this.toObject();
  story['id'] = story._id;
  return _.pick(story, 'id', 'user', 'abstract', 'body', 'bodyExcerpt', 'createdAt', 'tags', 'isPublished', 'project');
}

storySchema.pre('update', function() {
  this.update({},{ 
    $set: { 
      updatedAt: new Date()
    } 
  });
});

storySchema.index({
  'body': 'text'
})

module.exports = mongoose.model('Story', storySchema);