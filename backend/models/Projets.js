const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['actif', 'en pause', 'archivé'],
    default: 'actif'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });


// Suppression en cascade des tâches liées
projectSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const projectId = this.getFilter()._id;
  await mongoose.model('Task').deleteMany({ project: projectId });
  next();
});

module.exports = mongoose.model('Project', projectSchema);