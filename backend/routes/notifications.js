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

