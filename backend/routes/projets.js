const express = require('express');
const router = express.Router();
const Projet = require('../models/projets');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/projets — Liste paginée
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Projet.countDocuments({ owner: req.user._id });

    const projets = await Projet.find({ owner: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: projets,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/projets — Créer un projet
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Le titre est obligatoire' });
    }

    const projet = await Projet.create({
      title,
      description,
      deadline,
      owner: req.user._id
    });

    res.status(201).json(projet);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /api/projets/:id — Modifier un projet
router.put('/:id', async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id); // ✅ Corrigé

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    if (projet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const { title, description, deadline, status } = req.body;

    projet.title = title || projet.title;
    projet.description = description || projet.description;
    projet.deadline = deadline || projet.deadline;
    projet.status = status || projet.status;

    await projet.save();

    res.json(projet);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/projets/:id — Supprimer un projet + cascade
router.delete('/:id', async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    if (projet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await Projet.deleteOne({ _id: req.params.id });

    res.json({ message: 'Projet supprimé avec succès' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;