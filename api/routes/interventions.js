// Importation des modules nécessaires
const express = require("express");
const Intervention = require("../models/intervention");

// Création du routeur
const router = express.Router();

// Route pour obtenir toutes les interventions
router.get("/", async (req, res) => {
  try {
    const interventions = await Intervention.find();
    res.json(interventions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir le classement des chirurgiens
router.get("/ranking", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  // Convertir 'page' et 'limit' en nombres
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    // Récupérer toutes les interventions
    const interventions = await Intervention.find();

    // Création d'un objet pour stocker les statistiques de chaque chirurgien
    let stats = {};

    // Calcul des statistiques
    interventions.forEach((intervention) => {
      let surgeon = intervention.surgeon;
      let anesthsiste = intervention.anesthsiste;
      let nurse1 = intervention.nurse1;
      let nurse2 = intervention.nurse2;
      let roomNumber = intervention.roomNumber;
      let specialty = intervention.specialty;

      if (!stats[surgeon]) {
        stats[surgeon] = {
          specialty: specialty,
          numInterventions: 0,
          anesthsistes: {},
          nurses: {},
          rooms: {},
          interventions: {},
        };
      }

      stats[surgeon].numInterventions++;
      stats[surgeon].anesthsistes[anesthsiste] =
        (stats[surgeon].anesthsistes[anesthsiste] || 0) + 1;
      stats[surgeon].nurses[nurse1] = (stats[surgeon].nurses[nurse1] || 0) + 1;
      stats[surgeon].nurses[nurse2] = (stats[surgeon].nurses[nurse2] || 0) + 1;
      stats[surgeon].rooms[roomNumber] =
        (stats[surgeon].rooms[roomNumber] || 0) + 1;
      stats[surgeon].interventions[intervention.intervention] =
        (stats[surgeon].interventions[intervention.intervention] || 0) + 1;
    });

    // Création d'un tableau à partir de l'objet pour le trier
    let ranking = Object.entries(stats).map(([surgeon, data]) => {
      return {
        surgeon,
        specialty: data.specialty,
        numInterventions: data.numInterventions,
        favoriteAnesthetist: Object.entries(data.anesthsistes).sort(
          (a, b) => b[1] - a[1]
        )[0][0],
        favoriteNurse: Object.entries(data.nurses).sort(
          (a, b) => b[1] - a[1]
        )[0][0],
        frequentRoom: Object.entries(data.rooms).sort(
          (a, b) => b[1] - a[1]
        )[0][0],
        frequentProcedure: Object.entries(data.interventions).sort(
          (a, b) => b[1] - a[1]
        )[0][0],
      };
    });

    // Tri du tableau par le nombre d'interventions
    ranking.sort((a, b) => b.numInterventions - a.numInterventions);

    // Pagination du tableau
    const start = (page - 1) * limit;
    const end = page * limit;
    const pagedRanking = ranking.slice(start, end);

    res.json(pagedRanking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Exportation du routeur pour utilisation dans server.js
module.exports = router;
