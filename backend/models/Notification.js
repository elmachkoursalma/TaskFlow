const mongoose = require('mongoose');
//Le type de l'événement qui a déclenché la notification.
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['tache_assignee', 'statut_modifie', 'membre_ajoute'],
    required: true
  },
  