var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var SEED_TOKEN = require('../config/config').SEED_TOKEN;

var app = express();

// Importamos el User Schema
var User = require('../models/user');

// ============================================
// Google Auth
// ============================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                message: 'Token no válido'
            });
        });

    User.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }
        if (userDb) {
            if (userDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe iniciar sesión mediante nombre de usuario y contraseña',
                });
            } else {
                var token = jwt.sign({ user: userDb }, SEED_TOKEN, { expiresIn: 14400 }); //recibe un payload, un seed y las opciones
                res.status(200).json({
                    ok: true,
                    user: userDb,
                    token
                });
            }
        } else {
            //El usuario no existe, hay que crearlo
            var user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';
            user.save((err, userSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al guardar usuario',
                        errors: err
                    });
                }
                var token = jwt.sign({ user: userSaved }, SEED_TOKEN, { expiresIn: 14400 }); //recibe un payload, un seed y las opciones
                res.status(200).json({
                    ok: true,
                    user: userSaved,
                    token
                });
            });
        }
    });
});

// ============================================
// Normal Auth
// ============================================
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