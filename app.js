const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require("dotenv");
const cors = require('cors');
const MY_PORT = process.env.PORT;


// Mise à disposition des modules de sécurité (Helmet, rate-limiter)
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

// Initialisation des variables d'environnement
dotenv.config();

//mise a disposition des fichiers routes
const userRoutes = require('./routes/user');
const sauceRoutes = require("./routes/sauce");

// Connexion avec la Base de données MongoDB Atlas
mongoose.connect('mongodb+srv://emi:Fy7uT0rehfcObGDG@clustersauces.btbbshr.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Initialisation du module Express
const app = express();

// Initialisation de lecture des fichiers Json
app.use(express.json());

// Middleware permettant d'acceder a l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // * signifie : depuis n'importe quelle origine
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    ); // Autorise les méthodes de communication GET/POST/PUT...
    next();
});

// Initialisation du limiteur de requêtes à 100 sur 1h

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, //1h
    message: "Too many request from this IP"
});

// Initialisation d'Helmet (Sécurisation des headers)

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));


//middleware qui va transmetre les requettes vers ces url vers les routes correspondantes
app.use('/api/auth', userRoutes);
app.use("/api/sauces", sauceRoutes);

// Mise à disposition du chemin vers le répertoire image
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;