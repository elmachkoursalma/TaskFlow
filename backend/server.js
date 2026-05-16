const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err));

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API fonctionne ✅' });
});
app.get('/api/protected', authMiddleware, (req, res) => {

  res.json({
    message: 'Protected route access granted',
    user: req.user
  });

});
app.post('/test', (req, res) => {

  console.log(req.body);

  res.json(req.body);

});
app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
