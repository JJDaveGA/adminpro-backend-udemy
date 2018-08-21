var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED_TOKEN = require('../config/config').SEED_TOKEN;

var app = express();

// Importamos el User Schema
var User = require('../models/user');

app.post('/', (req, res) => {
    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        //Varificamos contraseña
        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        user.password = '';
        //Creamos token de usuario
        var token = jwt.sign({ user: user }, SEED_TOKEN, { expiresIn: 14400 }); //recibe un payload, un seed y las opciones

        res.status(200).json({
            ok: true,
            user,
            token
        });
    });
});

module.exports = app;