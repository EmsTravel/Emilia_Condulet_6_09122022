const User = require('../models/User'); // import model User
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Signup du User

exports.signup = (req, res, next) => {

    // hash du mot de passe  avec bcrypt

    bcrypt.hash(req.body.password, 10) //  10 fois l'algo hashage execute 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            // Vérification de l'input entrée par l'utilisateur dans le champ email avec un regex 

            if (!/^[\w\d.+-]+@[\w.-]+\.[a-z]{2,}$/.test(req.body.email)) {
                return res.status(400).json({ message: "email invalide" });
            }


            // Enregistrement des infos utilisateurs dans la bdd

            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// Login du User

exports.login = (req, res, next) => {

    // Vérification de l'input entrée par l'utilisateur dans le champ email avec un regex 

    if (!/^[\w\d.+-]+@[\w.-]+\.[a-z]{2,}$/.test(req.body.email)) {
        return res.status(400).json({ message: "email invalide" });
    }

    // Recherche de l'email dans la Base de données

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // Comparaison des Hash pour le mot de passe utilisateur

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};