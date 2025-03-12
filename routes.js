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

  // 📌 Route GET : Afficher le formulaire d'ajout
  router.get('/holidays/edit', (req, res) => {
    res.send(`
      <h2>Ajouter un Holiday</h2>
      <form action="/holidays" method="POST">
        <label>Date : <input type="date" name="date" required></label><br>
        <label>Année : <input type="number" name="annee" required></label><br>
        <label>Zone : <input type="text" name="zone" required></label><br>
        <label>Nom du jour férié : <input type="text" name="nom_jour_ferie" required></label><br>
        <button type="submit">Ajouter</button>
      </form>
    `);
  });

  // 📌 Route POST : Ajouter un holiday
  router.post('/holidays', async (req, res) => {
    try {
      const newHoliday = {
        date: new Date(req.body.date),
        annee: parseInt(req.body.annee),
        zone: req.body.zone,
        nom_jour_ferie: req.body.nom_jour_ferie
      };
      await db.collection('holidays').insertOne(newHoliday);
      res.redirect('/holidays'); // Redirection après ajout
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'ajout du holiday" });
    }
  });

  // 📌 Route GET : Afficher le formulaire de modification avec les données existantes
  router.get('/holidays/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const holiday = await db.collection('holidays').findOne({ _id: new ObjectId(id) });

      if (!holiday) {
        return res.status(404).send('Holiday non trouvé');
      }

      res.send(`
        <h2>Modifier un Holiday</h2>
        <form action="/holidays/edit/${id}" method="POST">
          <label>Date : <input type="date" name="date" value="${holiday.date.split('T')[0]}" required></label><br>
          <label>Année : <input type="number" name="annee" value="${holiday.annee}" required></label><br>
          <label>Zone : <input type="text" name="zone" value="${holiday.zone}" required></label><br>
          <label>Nom du jour férié : <input type="text" name="nom_jour_ferie" value="${holiday.nom_jour_ferie}" required></label><br>
          <button type="submit">Modifier</button>
        </form>
      `);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors du chargement du formulaire' });
    }
  });

  // 📌 Route POST : Modifier un holiday après soumission du formulaire
  router.post('/holidays/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedHoliday = {
        date: new Date(req.body.date),
        annee: parseInt(req.body.annee),
        zone: req.body.zone,
        nom_jour_ferie: req.body.nom_jour_ferie
      };

      await db.collection('holidays').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedHoliday }
      );
      res.redirect('/holidays'); // Redirection après modification
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
