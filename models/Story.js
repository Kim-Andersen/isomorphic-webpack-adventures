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

storySchema.post('save', function(story){
  ModelUtils.updateLatestStoriesOnUser(story.userId, function(err, user){
    console.log(err, user);
    if(err) {
      console.log('Failed to update "latestStories" on user after saving story.', err);
    }    
  });
})

storySchema.methods.toJSON = function() {
  var story = this.toObject();
  story['id'] = story._id;
  return _.pick(story, 'id', 'userId', 'text', 'createdAt', 'hashtags');
}

storySchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Story', storySchema);