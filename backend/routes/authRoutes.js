const express = require('express');
const router = express.Router();
const { inscription, connexion } = require('../controllers/auth.controller');

// POST /api/auth/inscription
router.post('/inscription', inscription);

// POST /api/auth/connexion
router.post('/connexion', connexion);

module.exports = router;

