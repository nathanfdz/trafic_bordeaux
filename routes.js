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
      <script src="/donnee_trafic.js"></script>
    `);
  });

  // 📌 Route POST : Ajouter une entrée dans la collection 'donnee_trafic'
  router.post('/donnee_trafic', async (req, res) => {
    try {
      const newTraffic = {
        _id: req.body._id,
        geo_point_2d: req.body.geo_point_2d,
        geo_shape: req.body.geo_shape,
        gid: req.body.gid,
        num_materiel: req.body.num_materiel || null,
        type: req.body.type || "COMPTAGE_ROUTIER",
        insee: req.body.insee,
        sens_orientation: req.body.sens_orientation || null,
        orientation: req.body.orientation || null,
        tmjo_tv: parseInt(req.body.tmjo_tv),
        tmjo_vl: parseInt(req.body.tmjo_vl),
        tmjo_pl: parseInt(req.body.tmjo_pl),
        hpm_tv: parseInt(req.body.hpm_tv),
        hps_tv: parseInt(req.body.hps_tv),
        v85_vl: parseFloat(req.body.v85_vl),
        v85_pl: req.body.v85_pl ? parseFloat(req.body.v85_pl) : null,
        annee: req.body.annee,
        semaine: req.body.semaine,
        orientation_av_2021: req.body.orientation_av_2021 || null,
        cdate: req.body.cdate,
        mdate: req.body.mdate
      };

      // Insérer la nouvelle entrée dans la base de données
      const result = await db.collection('donnee_trafic').insertOne(newTraffic);

      // Retourner l'objet ajouté en réponse JSON
      res.status(201).json(newTraffic); // 201 pour indiquer que la création a réussi
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'ajout de l'entrée de trafic" });
    }
  });

  // 📌 Route GET : Afficher le formulaire de modification d'une entrée existante
  router.get('/donnee_trafic/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const trafficData = await db.collection('donnee_trafic').findOne({ _id: new ObjectId(id) });

      if (!trafficData) {
        return res.status(404).send('Données non trouvées');
      }

      res.send(`
        <h2>Modifier un comptage routier</h2>
        <form action="/donnee_trafic/edit/${id}" method="POST">
          <label>ID : <input type="text" name="_id" value="${trafficData._id}" required></label><br>
          <label>Geo Point 2D : <input type="text" name="geo_point_2d" value="${trafficData.geo_point_2d}" required></label><br>
          <label>Geo Shape : <input type="text" name="geo_shape" value="${trafficData.geo_shape}" required></label><br>
          <label>GID : <input type="number" name="gid" value="${trafficData.gid}" required></label><br>
          <label>Numéro matériel : <input type="number" name="num_materiel" value="${trafficData.num_materiel || ''}"></label><br>
          <label>Type : <input type="text" name="type" value="${trafficData.type}" required></label><br>
          <label>INSEE : <input type="text" name="insee" value="${trafficData.insee}" required></label><br>
          <label>Sens Orientation : <input type="text" name="sens_orientation" value="${trafficData.sens_orientation || ''}"></label><br>
          <label>Orientation : <input type="text" name="orientation" value="${trafficData.orientation || ''}"></label><br>
          <label>TMJO TV : <input type="number" name="tmjo_tv" value="${trafficData.tmjo_tv}" required></label><br>
          <label>TMJO VL : <input type="number" name="tmjo_vl" value="${trafficData.tmjo_vl}" required></label><br>
          <label>TMJO PL : <input type="number" name="tmjo_pl" value="${trafficData.tmjo_pl}" required></label><br>
          <label>HP/M TV : <input type="number" name="hpm_tv" value="${trafficData.hpm_tv}" required></label><br>
          <label>HP/S TV : <input type="number" name="hps_tv" value="${trafficData.hps_tv}" required></label><br>
          <label>V85 VL : <input type="number" name="v85_vl" value="${trafficData.v85_vl}" required></label><br>
          <label>V85 PL : <input type="number" name="v85_pl" value="${trafficData.v85_pl || ''}"></label><br>
          <label>Année : <input type="text" name="annee" value="${trafficData.annee}" required></label><br>
          <label>Semaine : <input type="text" name="semaine" value="${trafficData.semaine}" required></label><br>
          <label>Orientation avant 2021 : <input type="text" name="orientation_av_2021" value="${trafficData.orientation_av_2021 || ''}"></label><br>
          <label>Date de création : <input type="text" name="cdate" value="${trafficData.cdate}" required></label><br>
          <label>Date de mise à jour : <input type="text" name="mdate" value="${trafficData.mdate}" required></label><br>
          <button type="submit">Modifier</button>
        </form>
      `);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors du chargement du formulaire de modification' });
    }
  });

  // 📌 Route POST : Modifier une entrée existante après soumission du formulaire
  router.post('/donnee_trafic/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTraffic = {
        _id: req.body._id,
        geo_point_2d: req.body.geo_point_2d,
        geo_shape: req.body.geo_shape,
        gid: req.body.gid,
        num_materiel: req.body.num_materiel || null,
        type: req.body.type || "COMPTAGE_ROUTIER",
        insee: req.body.insee,
        sens_orientation: req.body.sens_orientation || null,
        orientation: req.body.orientation || null,
        tmjo_tv: parseInt(req.body.tmjo_tv),
        tmjo_vl: parseInt(req.body.tmjo_vl),
        tmjo_pl: parseInt(req.body.tmjo_pl),
        hpm_tv: parseInt(req.body.hpm_tv),
        hps_tv: parseInt(req.body.hps_tv),
        v85_vl: parseFloat(req.body.v85_vl),
        v85_pl: req.body.v85_pl ? parseFloat(req.body.v85_pl) : null,
        annee: req.body.annee,
        semaine: req.body.semaine,
        orientation_av_2021: req.body.orientation_av_2021 || null,
        cdate: req.body.cdate,
        mdate: req.body.mdate
      };

      // Mettre à jour l'entrée dans la base de données
      await db.collection('donnee_trafic').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTraffic }
      );

      res.redirect('/donnee_trafic'); // Redirige après la modification
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la modification de l\'entrée de trafic' });
    }
  });

  // 📌 Route DELETE : Supprimer une entrée par son ID
  router.delete('/donnee_trafic/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.collection('donnee_trafic').deleteOne({ _id: new ObjectId(id) });
      res.json(result); // Renvoie le résultat de la suppression
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'entrée de trafic' });
    }
  });

  return router;
};
