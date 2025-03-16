const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); // Permettre l'envoi de JSON
app.use(cors()); // Éviter les erreurs CORS
app.use(express.urlencoded({ extended: true })); // Permettre l'envoi de formulaires

// Servir les fichiers statiques (formulaires HTML)
app.use(express.static(path.join(__dirname, 'public')));

const url = 'mongodb://localhost:27017';
const dbName = 'projetMongodb';

// Connexion à MongoDB
MongoClient.connect(url)
  .then(client => {
    const db = client.db(dbName);
    console.log('Connecté à MongoDB');

    // 🔥 Importer et utiliser les routes
    const routes = require('./routes')(db);
    app.use('/api', routes); // Ajout d'un préfixe API pour plus de clarté

    // Route principale pour servir le formulaire HTML
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'form.html'));
    });

    // Démarrer le serveur
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Erreur de connexion MongoDB :', err));
