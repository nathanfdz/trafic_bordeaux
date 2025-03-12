const express = require('express');
const { ObjectId } = require('mongodb');
const path = require('path');

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

  // 📌 Route GET : Afficher le formulaire d'ajout (HTML)
  router.get('/holidays/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-form.html'));
  });

  // 📌 Route POST : Ajouter un holiday (après soumission du formulaire)
  router.post('/holidays/add', async (req, res) => {
    try {
      const newHoliday = {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
      };
      await db.collection('holidays').insertOne(newHoliday);
      res.redirect('/holidays'); // Redirection vers la liste
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout du holiday' });
    }
  });

  // 📌 Route GET : Afficher le formulaire de modification
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
          <label>Nom : <input type="text" name="name" value="${holiday.name}" required></label><br>
          <label>Date : <input type="text" name="date" value="${holiday.date}" required></label><br>
          <label>Description : <textarea name="description" required>${holiday.description}</textarea></label><br>
          <button type="submit">Modifier</button>
        </form>
      `);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération du holiday' });
    }
  });

  // 📌 Route POST : Modifier un holiday (après soumission du formulaire)
  router.post('/holidays/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedHoliday = {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
      };
      await db.collection('holidays').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedHoliday }
      );
      res.redirect('/holidays'); // Redirection vers la liste
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la modification du holiday' });
    }
  });

  // 📌 Route DELETE : Supprimer un holiday par son ID
  router.delete('/holidays/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection('holidays').deleteOne({ _id: new ObjectId(id) });
      res.json({ message: 'Holiday supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression du holiday' });
    }
  });

  return router;
};
