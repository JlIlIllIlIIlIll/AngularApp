// Importation du module mongoose
const mongoose = require("mongoose");

// Création du schéma pour une intervention
const interventionSchema = new mongoose.Schema({
  surgeon: String,
  specialty: String,
  anesthsiste: String,
  nurse1: String,
  nurse2: String,
  roomNumber: Number,
  intervention: String,
});

// Création du modèle à partir du schéma et exportation pour utilisation dans d'autres fichiers
module.exports = mongoose.model("Intervention", interventionSchema);
