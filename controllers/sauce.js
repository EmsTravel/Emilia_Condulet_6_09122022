// use file system on the computer

const Sauce = require('../models/Sauce');
const fs = require("fs");



// Affichage de toutes les sauces

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);

        })
        .catch((error) => {
            res.status(400).json({ error: error })

        });

};

// Création d'une sauce
exports.createOneSauce = (req, res, next) => {

    // lecture de l'objet sauce en requête - convertir chaine de character en objet js

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;


    // Construction de l'objet sauce avec image

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    // Save  l'objet sauce en BDD

    sauce
        .save()
        .then(() => { res.status(201).json({ message: "Sauce saved !" }) })
        .catch((error) => { res.status(400).json({ error }) });
};



// Affichage d'une seule sauce

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};



// Modification d'une sauce

exports.modifySauce = (req, res, next) => {

    // Modification de la sauce

    if (!req.file) {
        // Modification de la sauce en BDD si aucune image en requête

        Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modified !" }))
            .catch((error) => res.status(400).json({ error }));
    } else {

        // Recherche de la sauce à modifier si il y a une image en requête

        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: new Error("No such Sauce!"),
                });
            }

            // Suppression de l'image précédente dans le système de fichiers

            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                console.log("image deleted");
            });
        });

        // Construction de l'objet sauce avec les modifications textuels et insertion de l'image dans le système de fichiers

        const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
     req.file.filename
   }`,
        };

        // Modification de la sauce avec la nouvelle image

        Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "sauce modified" }))
            .catch((error) => res.status(400).json({ error }));
    }
};



// supprimer les sauces
exports.deleteSauce = (req, res, next) => {

    // Recherche de la sauce en requête dans la BDD

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
            res.status(404).json({
                error: new Error("No such Sauce!")
            });
        }

        // Comparaison de l'userId pour que seul le propriétaire de la sauce puisse delete

        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
                error: new Error('Unauthorized request!')
            });
        }

        // Suppression de l'image dans le système de fichiers et de son lien en BDD

        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "Deleted!",
                    });
                })
                .catch((error) => {
                    res.status(400).json({
                        error: error,
                    });
                });
        });
    });
};


// Système de Like/Dislike

exports.like = async(req, res, next) => {
    try {

        // Recherche d'une sauce par son Id

        const sauce = await Sauce.findById(req.params.id);

        // Mise à disposition des valeurs dans la requête body dans des variables

        let userId = req.body.userId;
        let like = req.body.like;
        let usersLiked = sauce.usersLiked;
        let usersDisliked = sauce.usersDisliked;

        // Construction switch afin de traîter les différents cas (1, 0, -1)

        switch (like) {
            case 1:

                // Vérification de la présence de l'userId dans le tableau usersLiked

                if (usersLiked === usersLiked.includes(userId)) {
                    return usersLiked;
                } else {
                    usersLiked.addToSet(userId);
                }

                // Mise à jour du tableau

                usersDisliked = usersDisliked.filter((element) => el !== req.userId);
                break;
            case -1:

                // Vérification de la présence de l'userId dans le tableau usersDisliked

                if (usersDisliked === usersDisliked.includes(userId)) {
                    return usersDisliked;
                } else {
                    usersDisliked.addToSet(userId);
                }

                // Mise à jour du tableau userDisliked

                usersLiked = usersLiked.filter((element) => element !== userId);
                break;

            case 0:

                // Filtrage des tableaux pour en retirer l'userId

                usersLiked = usersLiked.filter((element) => element !== userId);
                usersDisliked = usersDisliked.filter((element) => element !== userId);
                break;



            default:
                throw res.status(418).json({ err });
        }
        // Mise à disposition du nombre de likes et dislikes dans des variables

        const likes = usersLiked.length;
        const dislikes = usersDisliked.length;

        // Modification des valeurs concernées dans l'objet sauce

        await sauce.updateOne({
            usersLiked: usersLiked,
            usersDisliked: usersDisliked,
            likes: usersDisliked.length,

            likes: usersLiked.length,

        });

        res.status(200).send({ message: "item liked or disliked" });
    } catch (err) {
        res.status(400).json({ err });
    }
};