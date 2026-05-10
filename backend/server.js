const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const projectRoutes = require('./routes/projets');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // ✅ ICI dehors

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API fonctionne ✅' });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route access granted',
    user: req.user
  });
}); // ✅ Fermée correctement

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err));

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
