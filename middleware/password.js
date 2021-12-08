const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, un caractère majuscule et un caractère spécial'})
    } else {
        next();
    }
}