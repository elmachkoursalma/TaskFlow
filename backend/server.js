const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middlewares
app.use(express.json()); 
app.use(cors());

// Route Definitions
app.use('/api/auth', authRoutes);

app.use('/api/projects', require('./routes/membres'));
app.use('/api/projects', projectRoutes); 

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Database Connection
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/projects', require('./routes/membres'));
app.use('/api/notifications', require('./routes/notifications'));


// Test Route
app.get('/', (req, res) => {

  res.json({
    message: 'TaskFlow API fonctionne ✅'
  });

});


// Protected Route
app.get('/api/protected', authMiddleware, (req, res) => {

  res.json({

    message: 'Protected route access granted',
    user: req.user

  });

});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch((err) => console.error('Erreur de connexion MongoDB :', err));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running ✅' });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});