// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importation des routeurs
const interventionsRouter = require("./routes/interventions");

// Initialisation de l'application Express
const app = express();

// Utilisation du middleware CORS pour autoriser les requêtes de différentes origines
app.use(cors());

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb+srv://Proton:%5eo%407%21%21q6GnJZig%23HMceD8Xqum4%26HzM@cluster0.a6bbqim.mongodb.net/hospitalDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Utilisation du routeur pour les interventions
app.use("/api/interventions", interventionsRouter);

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
