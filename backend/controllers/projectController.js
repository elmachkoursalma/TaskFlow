const Project = require('../models/Project');

const Project = require('../models/Project');

// GET — Liste paginée
exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments({ owner: req.user.id });
    const projects = await Project.find({ owner: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ data: projects, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST — Créer un projet
exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ message: 'Le titre est obligatoire' });

    const project = new Project({
      title,
      description,
      deadline,
      owner: req.user.id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PUT — Modifier un projet
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const { title, description, deadline, status } = req.body;
    project.title       = title       || project.title;
    project.description = description || project.description;
    project.deadline    = deadline    || project.deadline;
    project.status      = status      || project.status;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// DELETE — Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await project.deleteOne();
    res.json({ message: 'Projet et tâches associées supprimés' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};