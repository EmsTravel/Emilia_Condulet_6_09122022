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



// Modifiér la sauce

exports.modifySauce = (req, res, next) => {
    // Find the sauce in the database
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                // If the sauce is not found in the database, return a 404 error
                return res.status(404).json({ error: "Sauce not found" });
            }

            // Comparaison de l'userId pour que seul le propriétaire de la sauce puisse modifiér

            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({
                    error: new Error('Unauthorized request!')
                });
            }
            // Update the sauce in the database
            if (!req.file) {
                // If no image in request, update only the text fields
                Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modified" }))
                    .catch((error) => res.status(400).json({ error }));
            } else {
                // If there is an image in the request, update the image and text fields
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                };
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modified" }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};



// supprimer la sauce
exports.deleteSauce = (req, res, next) => {

    // Recherche de la sauce en requête dans la BDD

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
            res.status(404).json({
                error: new Error("No such Sauce!")
            });
        }

        // Comparaison de l'userId pour que seul le propriétaire de la sauce puisse faire delete

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


exports.likeSauce = (req, res, next) => {
    // get user id and like value from request body
    let id_check = req.body.userId;
    let likes = req.body.like;

    // find the sauce in the database with the id from the URL parameter
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (likes) {
                // si l'utilisateur retire son like ou son dislike
                case 0:
                    if (sauce.usersLiked.includes(id_check)) {
                        // if user already liked the sauce, remove  his id from the list UsersLiked and decrement likes
                        Sauce.updateOne({ _id: req.params.id }, {
                                $pull: { usersLiked: id_check },
                                $inc: { likes: -1 }
                            })
                            .then(() => res.status(201).json({ message: "Like annulé" }))
                            .catch((error) => res.status(400).json({ message: error }));
                    }
                    if (sauce.usersDisliked.includes(id_check)) {
                        // if user already disliked the sauce, remove their dislike
                        Sauce.updateOne({ _id: req.params.id }, {
                                $pull: { usersDisliked: id_check },
                                $inc: { dislikes: -1 }
                            })
                            .then(() => res.status(201).json({ message: "Dislike annulé" }))
                            .catch((error) => res.status(400).json({ message: error }));
                    }
                    break;

                    // si le user like on incremente le champ likes et on ajoute son user Id dans la liste userLiked
                case 1:
                    if (!sauce.usersLiked.includes(id_check)) {
                        // if user has not already liked the sauce, add their like
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: 1 },
                                $push: { usersLiked: id_check }
                            })
                            .then(() => res.status(201).json({ message: "Sauce likée" }))
                            .catch((error) => res.status(400).json({ message: error }));
                    }
                    break;

                    // If the like is -1 (disliked), add the user's dislike to the userDisliked array
                case -1:
                    if (!sauce.usersDisliked.includes(id_check)) {
                        // if user has not already disliked the sauce, add their dislike
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: id_check }
                            })
                            .then(() => res.status(201).json({ message: "Sauce dislikée" }))
                            .catch((error) => res.status(400).json({ message: error }));
                    }
                    break;

                    // If the like value is not valid, return an error
                default:
                    res.status(400).json({ error: "Invalid like value" });
                    break;
            }
        })
        .catch((error) => res.status(500).json({ error }));
};