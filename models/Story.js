import mongoose from 'mongoose'
import _ from 'lodash';
import { ModelUtils } from './'

// Define our user schema
var storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  abstract: {
    type: String,
    unique: false,
    required: true,
    minlength: 1,
    maxlength: 140
  },
  body: {
    type: String,
    unique: false,
    required: false
  },
  hasBody: {
    type: Boolean,
    required: true,
    default: false
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
  tags: {
    type: [String],
    required: false
  },
  isPublished: {
    type: Boolean, 
    default: false,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  }
});

storySchema.pre('save', function(next) {
  this.hasBody = (this.body && this.body.length > 0)
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
  return _.pick(story, 'id', 'user', 'abstract', 'body', 'createdAt', 'tags', 'isPublished', 'project');
}

storySchema.pre('update', function() {
  this.update({},{ 
    $set: { 
      updatedAt: new Date()
    } 
  });
});

module.exports = mongoose.model('Story', storySchema);