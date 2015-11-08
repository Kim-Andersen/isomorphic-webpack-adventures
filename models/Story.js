var mongoose = require('mongoose');
import _ from 'lodash';

// Define our user schema
var StorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
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
  }
});

StorySchema.methods.toJSON = function() {
  var story = this.toObject();
  story['id'] = story._id;
  return _.pick(story, 'id', 'userId', 'text', 'createdAt');
}

StorySchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Story', StorySchema);