const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:{ 
    type : String, 
    required: true 
  },
  description: { 
    type: String 
  },
  deadline:{ 
    type : Date 
  },
  status: {
    type: String,
    enum: ['actif', 'en pause', 'archivé'],
    default: 'actif'
  },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Suppression en cascade des tâches liées au projet
projectSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('Task').deleteMany({ project: this._id });
});

module.exports = mongoose.model('Project', projectSchema);