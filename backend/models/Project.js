const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
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

projetSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const projetId = this.getFilter()._id;
  await mongoose.model('Task').deleteMany({ project: projetId });
  next();
});

module.exports = mongoose.model('Projet', projetSchema);