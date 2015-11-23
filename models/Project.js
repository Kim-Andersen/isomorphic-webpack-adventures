import mongoose from 'mongoose'
import _ from 'lodash'

var projectSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  type: {
    type: String,
    required: false
  }
});

projectSchema.methods.toJSON = function() {
  var project = this.toObject();
  project['id'] = project._id;
  return _.pick(project, 
    'id',
    'user',
    'title', 
    'created', 
    'type'
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