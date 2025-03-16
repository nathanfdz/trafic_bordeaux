const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  // 📌 Route GET : Récupérer les 20 premiers éléments de la collection 'donnee_trafic'
  router.get('/donnee_trafic', async (req, res) => {
    try {
      const donneeTrafic = await db.collection('donnee_trafic').find().limit(20).toArray();
      res.json(donneeTrafic); // Retourne les données sous format JSON
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données de trafic' });
    }
  });

  // 📌 Route GET : Afficher le formulaire d'ajout d'une nouvelle entrée
  router.get('/donnee_trafic/edit', (req, res) => {
    res.send(`
      <h2>Ajouter un comptage routier</h2>
      <form id="trafficForm">
        <label>ID : <input type="text" name="_id" required></label><br>
        <label>Geo Point 2D : <input type="text" name="geo_point_2d" required></label><br>
        <label>Geo Shape : <input type="text" name="geo_shape" required></label><br>
        <label>GID : <input type="number" name="gid" required></label><br>
        <label>Numéro matériel : <input type="number" name="num_materiel"></label><br>
        <label>Type : <input type="text" name="type" value="COMPTAGE_ROUTIER" required></label><br>
        <label>INSEE : <input type="text" name="insee" required></label><br>
        <label>Sens Orientation : <input type="text" name="sens_orientation"></label><br>
        <label>Orientation : <input type="text" name="orientation"></label><br>
        <label>TMJO TV : <input type="number" name="tmjo_tv" required></label><br>
        <label>TMJO VL : <input type="number" name="tmjo_vl" required></label><br>
        <label>TMJO PL : <input type="number" name="tmjo_pl" required></label><br>
        <label>HP/M TV : <input type="number" name="hpm_tv" required></label><br>
        <label>HP/S TV : <input type="number" name="hps_tv" required></label><br>
        <label>V85 VL : <input type="number" name="v85_vl" required></label><br>
        <label>V85 PL : <input type="number" name="v85_pl"></label><br>
        <label>Année : <input type="text" name="annee" required></label><br>
        <label>Semaine : <input type="text" name="semaine" required></label><br>
        <label>Orientation avant 2021 : <input type="text" name="orientation_av_2021"></label><br>
        <label>Date de création : <input type="text" name="cdate" required></label><br>
        <label>Date de mise à jour : <input type="text" name="mdate" required></label><br>
        <button type="submit">Ajouter</button>
      </form>
      <ul id="trafficList"></ul>
      <script src="/donnee_trafic"></script>
    `);
  });

  // 📌 Route POST : Ajouter une nouvelle donnée de trafic
  router.post('/donnee_trafic', async (req, res) => {
    try {
      const newTrafficData = req.body;

      // Insérer les nouvelles données dans MongoDB
      const result = await db.collection('donnee_trafic').insertOne(newTrafficData);

      res.status(201).json(result.ops[0]); // Retourner l'élément inséré
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout des données de trafic' });
    }
  });

  // 📌 Route GET : Statistiques (Agrégations)
  router.get('/donnee_trafic/aggregations', async (req, res) => {
    try {
      const stats = await db.collection('donnee_trafic')
        .aggregate([
          { $group: { _id: null, totalTMJO: { $sum: "$tmjo_tv" } } },
          { $project: { totalTMJO: 1, _id: 0 } }
        ])
        .toArray();

      res.json(stats); // Retourne les agrégations sous format JSON
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors des agrégations' });
    }
  });

  return router;
};
