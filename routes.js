const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  // 📌 Route GET : Récupérer les 20 premiers holidays
  router.get('/holidays', async (req, res) => {
    try {
      const holidays = await db.collection('holidays').find().limit(20).toArray();
      res.json(holidays);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des holidays' });
    }
  });

  // 📌 Route POST : Ajouter un holiday
  router.post('/holidays', async (req, res) => {
    try {
      const newHoliday = req.body;
      const result = await db.collection('holidays').insertOne(newHoliday);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout du holiday' });
    }
  });

  // 📌 Route PUT : Modifier un holiday par son ID
  router.put('/holidays/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedHoliday = req.body;
      const result = await db.collection('holidays').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedHoliday }
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la modification du holiday' });
    }
  });

  // 📌 Route DELETE : Supprimer un holiday par son ID
  router.delete('/holidays/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.collection('holidays').deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression du holiday' });
    }
  });

  return router;
};
