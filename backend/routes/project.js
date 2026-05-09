const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);  // Toutes les routes sont protégées

// GET /api/projects — Liste paginée
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments({ owner: req.user._id });

    const projects = await Project.find({ owner: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/projects — Créer un projet
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Le titre est obligatoire' });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      owner: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /api/projects/:id — Modifier un projet
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    // Vérifier que c'est bien le créateur
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const { title, description, deadline, status } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;
    project.status = status || project.status;

    await project.save();

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/projects/:id — Supprimer un projet + cascade
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    // Vérifier que c'est bien le créateur
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    // deleteOne déclenche le middleware de cascade
    await Project.deleteOne({ _id: req.params.id });

    res.json({ message: 'Projet supprimé avec succès' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;