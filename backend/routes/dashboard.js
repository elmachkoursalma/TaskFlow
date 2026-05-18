const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
//Quand le frontend appelle GET /api/dashboard, cette fonction s'exécute. Le authMiddleware vérifie d'abord que l'utilisateur est bien connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // 1. Compter les projets actifs
    
    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: 'actif'
    });

    // 2. Stats des tâches via pipeline MongoDB
    //total: Compte toutes les tâches assignées à toi.
    //done:  Compte celles dont le statut est terminé.
    //overdue: Compte celles dont la deadline est dépassée ET pas encore terminées.
    const taskStats = await Task.aggregate([
      {
        $match: { assignedTo: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          done: {
            $sum: { $cond: [{ $eq: ['$status', 'terminé'] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'terminé'] },
                    { $lt: ['$deadline', now] }
                  ]
                },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    // 3. Tâches en cours triées dans cet ordre :
        //    a. haute priorité + deadline proche
        //    b. haute priorité + deadline lointaine
        //    c. moyenne priorité... 
        //    d. basse priorité...
    const priorityRank = { haute: 1, moyenne: 2, basse: 3 };

    const inProgressTasks = await Task.find({
      assignedTo: userId,
      status: { $ne: 'terminé' }
    })
      .populate('project', 'title')
      .lean();

    inProgressTasks.sort((a, b) => {
      const pa = priorityRank[a.priority] ?? 99;
      const pb = priorityRank[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });

    const stats = taskStats[0] ?? { total: 0, done: 0, overdue: 0 };
    //Tout est envoyé en un seul appel au frontend
    res.json({
      activeProjects,
      assignedTasks: stats.total,
      doneTasks: stats.done,
      overdueTasks: stats.overdue,
      inProgressTasks
    });

  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;