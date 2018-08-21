var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

// Importamos el User Schema
var User = require('../models/user');

// ============================================
// GET: Obtiene todos los usuarios
// ============================================
app.get('/', (req, res) => {
    User.find({}, 'name email img role').exec((err, users) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al cargar usuarios',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            users
        });
    });
});

// ============================================
// POST: Crear un nuevo usuario
// ============================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // Encriptamos contraseña con bcrypt
        img: body.img,
        role: body.role
    });
    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            user: userSaved
        });
    });
});

// ============================================
// PUST: Actualizar un usuario por id
// ============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    User.findById(id, (err, user) => {
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
                message: 'El usuario con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un usuario con el id ' + id
                }
            });
        }
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        user.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            }
            userSaved.password = '';
            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });
    });
});

// ============================================
// DELETE: Eliminar un usuario por id
// ============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un usuario con el id ' + id
                }
            });
        }
        userDeleted.password = '';
        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});

module.exports = app;