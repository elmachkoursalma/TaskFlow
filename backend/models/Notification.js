const mongoose = require('mongoose');
//Le type de l'événement qui a déclenché la notification.
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['tache_assignee', 'statut_modifie', 'membre_ajoute'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  //L'identifiant de l'utilisateur qui reçoit la notification.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //Indique si l'utilisateur a lu la notification ou pas.
  lu: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);