var express = require('express');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

// Importamos el Hospital Schema
var Hospital = require('../models/hospital');

// ============================================
// GET: Obtiene todos los hospitales
// ============================================
app.get('/', (req, res) => {
    var from = +(req.query.from || 0);
    var limit = +(req.query.to || 5);
    Hospital.find({})
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al cargar hospitales',
                    errors: err
                });
            }
            Hospital.count({}, (err, hospitalCount) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar hospitales',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospitals,
                    total: hospitalCount
                });
            });
        });
});

// ============================================
// POST: Crear un nuevo hospital
// ============================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });
    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });
    });
});

// ============================================
// PUT: Actualizar un hospital por id
// ============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un hospital con el id ' + id
                }
            });
        }
        hospital.name = body.name;
        hospital.user = req.user._id;
        hospital.save((err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });
        });
    });
});

// ============================================
// DELETE: Eliminar un hospital por id
// ============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un hospital con el id ' + id
                }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        });
    });
});

module.exports = app;