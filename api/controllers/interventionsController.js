// Importation du modèle Intervention
const Intervention = require("../models/intervention");

// Fonction pour obtenir toutes les interventions
const getAllInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find();
    res.json(interventions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour calculer la valeur la plus fréquente dans un tableau
function mostFrequent(arr) {
  // On trie le tableau en se basant sur le nombre d'occurrences de chaque valeur.
  // La valeur qui apparaît le plus de fois sera la dernière du tableau trié.
  // La fonction pop() est alors utilisée pour récupérer cette valeur.
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}

const getAllRankings = async function (req, res) {
  // On récupère les paramètres de pagination de la requête, avec des valeurs par défaut si elles ne sont pas fournies.
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    // On exécute l'opération d'aggrégation sur notre collection d'interventions.
    const nurse1Ranking = await Intervention.aggregate([
      {
        $group: {
          // On groupe les documents par chirurgien.
          _id: "$surgeon",
          // On conserve la première spécialité rencontrée pour chaque chirurgien.
          specialty: { $first: "$specialty" },
          // On compte le nombre d'interventions pour chaque chirurgien.
          numInterventions: { $sum: 1 },
          // On crée une liste des anesthésistes pour chaque chirurgien.
          anesthsistes: { $push: "$anesthsiste" },
          // On crée une liste des infirmières pour chaque chirurgien.
          nurses: { $push: "$nurse1" },
          // On crée une liste des salles pour chaque chirurgien.
          rooms: { $push: "$roomNumber" },
          // On crée une liste des types d'intervention pour chaque chirurgien.
          interventions: { $push: "$intervention" },
        },
      },
      {
        // On trie les résultats par nombre d'interventions décroissant.
        $sort: { numInterventions: -1 },
      },
    ]);

    const nurse2Ranking = await Intervention.aggregate([
      {
        $group: {
          // On groupe les documents par chirurgien.
          _id: "$surgeon",
          // On conserve la première spécialité rencontrée pour chaque chirurgien.
          specialty: { $first: "$specialty" },
          // On compte le nombre d'interventions pour chaque chirurgien.
          numInterventions: { $sum: 1 },
          // On crée une liste des anesthésistes pour chaque chirurgien.
          anesthsistes: { $push: "$anesthsiste" },
          // On crée une liste des infirmières pour chaque chirurgien.
          nurses: { $push: "$nurse2" },
          // On crée une liste des salles pour chaque chirurgien.
          rooms: { $push: "$roomNumber" },
          // On crée une liste des types d'intervention pour chaque chirurgien.
          interventions: { $push: "$intervention" },
        },
      },
      {
        // On trie les résultats par nombre d'interventions décroissant.
        $sort: { numInterventions: -1 },
      },
    ]);

    // Fusionnez les deux tableaux de résultats
    const mergedRanking = mergeRankings(nurse1Ranking, nurse2Ranking);

    // Fonction pour fusionner les classements des infirmières
    function mergeRankings(nurse1Ranking, nurse2Ranking) {
      return nurse1Ranking.map((doc, i) => {
        const nurse2Doc = nurse2Ranking[i];
        return {
          ...doc,
          nurses: doc.nurses.concat(nurse2Doc.nurses),
        };
      });
    }

    // Pour chaque document dans notre résultat d'aggrégation, on calcule la valeur la plus fréquente pour chaque liste,
    // et on renomme _id en surgeon.
    mergedRanking.forEach((doc) => {
      doc.surgeon = doc._id;
      doc.favoriteAnesthetist = mostFrequent(doc.anesthsistes);
      doc.favoriteNurse = mostFrequent(doc.nurses);
      doc.frequentRoom = mostFrequent(doc.rooms);
      doc.frequentProcedure = mostFrequent(doc.interventions);
      delete doc._id;
      delete doc.anesthsistes;
      delete doc.nurses;
      delete doc.rooms;
      delete doc.interventions;
    });

    // On applique la pagination aux résultats.
    const start = (page - 1) * limit;
    const end = page * limit;
    const pagedRanking = mergedRanking.slice(start, end);

    // On envoie les résultats au client.
    res.json(pagedRanking);
  } catch (err) {
    // En cas d'erreur, on envoie un message d'erreur au client.
    res.status(500).json({ message: err.message });
  }
};

// Exportation des fonctions du contrôleur
module.exports = {
  getAllInterventions,
  getAllRankings,
};
