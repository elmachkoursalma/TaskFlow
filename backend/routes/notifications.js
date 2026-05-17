const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// ── 1. Récupérer toutes les notifications ──
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    console.error('Erreur notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── 2. Marquer comme lue ──
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

// ── 3. Créer une notification ──
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, message, userId } = req.body;

    const notification = new Notification({
      type,
      message,
      user: userId
    });

    await notification.save();
    res.status(201).json(notification);

  } catch (error) {
    console.error('Erreur création notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;