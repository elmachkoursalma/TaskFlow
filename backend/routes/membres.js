const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project'); 
const authMiddleware = require('../middleware/authMiddleware');

// ── 1. Inviter un membre par email ──
router.post('/:projectId/invite', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte trouvé avec cet email' });
    }

    // Vérifier que le projet existe et que c'est le créateur
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (project.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Accès refusé — vous n\'êtes pas le créateur' });
    }

    // Vérifier que le membre n'est pas déjà dans le projet
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre du projet' });
    }

    // Ajouter le membre
    project.members.push(user._id);
    await project.save();

    res.json({ message: `${user.name} a été invité avec succès` });

  } catch (error) {
    console.error('Erreur invitation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── 2. Retirer un membre ──
router.delete('/:projectId/members/:memberId', authMiddleware, async (req, res) => {
  try {

    // Vérifier que c'est le créateur
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé — vous n\'êtes pas le créateur' });
    }

    // Retirer le membre
     project.members = project.members.filter(
       m => m.toString() !== req.params.memberId
     );
     await project.save();

    res.json({ message: 'Membre retiré avec succès' });

  } catch (error) {
    console.error('Erreur retrait membre:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── 3. Liste des membres d'un projet ──
router.get('/:projectId/members', authMiddleware, async (req, res) => {
  try {

    const project = await Project.findById(req.params.projectId)
       .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    res.json(project.members);
    

  } catch (error) {
    console.error('Erreur liste membres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;