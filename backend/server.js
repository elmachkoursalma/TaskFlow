const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projets');

const app = express();

app.use(express.json());
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);


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

  .then(() => console.log('MongoDB connecté'))

  .catch((err) =>
    console.error('Erreur MongoDB :', err)
  );


// Start Server
app.listen(process.env.PORT, () => {

  console.log(
    `Serveur démarré sur le port ${process.env.PORT}`
  );

});
