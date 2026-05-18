const Activity = require('../models/Activity');

// Fonction réutilisable pour enregistrer une activité
const logActivity = async (type, projectId, userId, meta = {}) => {
  try {
    await Activity.create({ type, project: projectId, user: userId, meta });
  } catch (err) {
    console.error('Erreur logActivity:', err.message);
  }
};

// GET /api/projects/:id/activities
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.logActivity = logActivity;