const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// POST /api/auth/inscription
router.post('/register', register);

// POST /api/auth/connexion
router.post('/login', login);

module.exports = router;

