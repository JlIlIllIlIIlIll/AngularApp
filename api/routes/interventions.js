// Importation des modules nécessaires
const express = require("express");
const interventionsController = require("../controllers/interventionsController");

// Création du routeur
const router = express.Router();

// Route pour obtenir toutes les interventions
router.get("/", interventionsController.getAllInterventions);

// Route pour obtenir le classement des chirurgiens
router.get("/ranking", interventionsController.getAllRankings);

// Exportation du routeur pour utilisation dans server.js
module.exports = router;
