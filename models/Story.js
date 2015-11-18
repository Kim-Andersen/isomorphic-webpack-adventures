import mongoose from 'mongoose'
import _ from 'lodash';
import { ModelUtils } from './'

// Define our user schema
var storySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    unique: false,
    required: true,
    minlength: 1
  },
  textShort: {
    type: String,
    unique: false,
    required: false,
    maxlength: 140
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
  hashtags: {
    type: [String],
    required: false
  },
  isPublished: {
    type: Boolean, 
    default: false,
    required: false
  }
});

storySchema.pre('save', function(next) {
  this.textShort = this.text.substring(0,140);
  next();
})

storySchema.post('save', function(story, next){
  ModelUtils.updateLatestStoriesOnUser(story.userId, function(err, user){
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
  return _.pick(story, 'id', 'userId', 'text', 'textShort', 'createdAt', 'hashtags', 'isPublished');
}

storySchema.pre('update', function() {
  this.update({},{ 
    $set: { 
      updatedAt: new Date(),
      textShort: this.text.substring(0,140)
    } 
  });
});

module.exports = mongoose.model('Story', storySchema);