const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const userRoutes = require('./routes/user');
const cors = require('cors');
const MY_PORT = process.env.PORT;

// Initialisation des variables d'environnement
dotenv.config();

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


//middleware qui va transmetre les requettes vers ces url vers les routes correspondantes
app.use('/api/auth', userRoutes);



module.exports = app;