const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// creation de Schema de donnees avec les champs souhaités dans la bdd
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


// model pour avoir un email unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);