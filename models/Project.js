import mongoose from 'mongoose'
import _ from 'lodash'

var projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
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

projectSchema.methods.toJSON = function() {
  var project = this.toObject();
  project['id'] = project._id;
  return _.pick(project, 
    'id',
    'userId',
    'title', 
    'created', 
    'twitter'
  );
}

projectSchema.pre('save', function(next) {
  var project = this
  project.updatedAt = new Date()
  next()
});

projectSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

export default mongoose.model('Project', projectSchema)