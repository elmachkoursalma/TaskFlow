const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// ── 1. Récupérer toutes les notifications de l'utilisateur ──
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 }); // plus récente en premier

    res.json(notifications);

  } catch (error) {
    console.error('Erreur notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// ── 2. Marquer une notification comme lue ──
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { lu: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }

    res.json(notification);

  } catch (error) {
    console.error('Erreur mise à jour notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


