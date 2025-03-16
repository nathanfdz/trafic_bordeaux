const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  //  Récupérer les données avec pagination et tri
  router.get('/donnee_trafic', async (req, res) => {
    try {
      const { page = 1, limit = 20, sortBy = 'tmjo_tv', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sortBy]: order === 'desc' ? -1 : 1 }
      };

      const donneeTrafic = await db.collection('donnee_trafic').find({}, options).toArray();
      const total = await db.collection('donnee_trafic').countDocuments();

      res.json({ data: donneeTrafic, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
  });

  //  Servir le formulaire HTML
  router.get('/donnee_trafic/edit', (req, res) => {
    res.sendFile(__dirname + '/form.html');
  });

  // Ajouter une nouvelle donnée de trafic
  router.post('/donnee_trafic', async (req, res) => {
    try {
      const newTrafficData = req.body;
      const result = await db.collection('donnee_trafic').insertOne(newTrafficData);
      res.status(201).json({ message: 'Donnée ajoutée avec succès', data: result.ops[0] });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout des données' });
    }
  });

  // Récupérer des statistiques (somme et moyenne TMJO TV)
  router.get('/donnee_trafic/aggregations', async (req, res) => {
    try {
      const stats = await db.collection('donnee_trafic').aggregate([
        { $group: { _id: null, totalTMJO: { $sum: "$tmjo_tv" }, moyenneTMJO: { $avg: "$tmjo_tv" } } },
        { $project: { _id: 0, totalTMJO: 1, moyenneTMJO: 1 } }
      ]).toArray();

      res.json(stats[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors des agrégations' });
    }
  });

  return router;
};
