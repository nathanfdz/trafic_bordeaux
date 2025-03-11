const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'projet_mongodb';  // Ton nom de base de données

async function connectDB() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connexion à la base de données MongoDB réussie !");
    const db = client.db(dbName);
    // Tu peux ajouter du code pour manipuler les données ici
  } catch (err) {
    console.error("Erreur de connexion :", err);
  } finally {
    await client.close();
  }
}

connectDB();
