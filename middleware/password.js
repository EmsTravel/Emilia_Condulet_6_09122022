//importation de password validator

const passwordValidator = require("password-validator");

//creation du schéma
const passwordSchema = new passwordValidator();


// le schéma que doit respecter le mot de passe
passwordSchema
    .is().min(5) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123']); // Blacklist these values



// Verification de la qualité du password par rapport au schéma

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res
            .status(400)
            .json({ error: "Le mot de passe n'est pas assez fort:" + passwordSchema.validate('req.body.password', { list: true }) })
    }
}