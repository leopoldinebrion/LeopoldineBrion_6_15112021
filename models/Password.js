const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

//le schéma que doit respecter le mpd
passwordSchema
.is().min(6)                  // au moins 6 caractères 
.is().max(100)               // max 100 caractères 
.has().uppercase(1)         // au moins 1 Majuscule
.has().digits(1)           // au moins 1 chiffre
.has().not().spaces()     // pas d'espaces
.has().symbols()         // doit avoir symbole
.has().not().symbols(2) // max 2 symboles

//exportation du schéma -> importé dans middleware/password
module.exports = passwordSchema;