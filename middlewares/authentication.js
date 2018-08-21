var jwt = require('jsonwebtoken');

var SEED_TOKEN = require('../config/config').SEED_TOKEN;

// ============================================
// Middeware para verificar token
// ============================================
exports.verifyToken = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token inválido',
                errors: err
            });
        }
        //pasamos el objeto de usuario al request
        req.user = decoded.user;
        next();
    });
};