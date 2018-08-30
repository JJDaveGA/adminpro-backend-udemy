var express = require('express');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

// Importamos el Doctor Schema
var Doctor = require('../models/doctor');

// ============================================
// GET: Obtiene todos los médicos
// ============================================
app.get('/', (req, res) => {
    var from = +(req.query.from || 0);
    var limit = +(req.query.to || 5);
    Doctor.find({})
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al cargar médicos',
                    errors: err
                });
            }
            Doctor.count({}, (err, doctorCount) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar médicos',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    doctors,
                    total: doctorCount
                });
            });
        });
});

// ============================================
// POST: Crear un nuevo médico
// ============================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });
    doctor.save((err, doctorSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear médico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            doctor: doctorSaved
        });
    });
});

// ============================================
// PUT: Actualizar un médico por id
// ============================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar médico',
                errors: err
            });
        }
        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'El médico con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un médico con el id ' + id
                }
            });
        }
        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;
        doctor.save((err, doctorSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar médico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });
        });
    });
});

// ============================================
// DELETE: Eliminar un médico por id
// ============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar médico',
                errors: err
            });
        }
        if (!doctorDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'El médico con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un médico con el id ' + id
                }
            });
        }
        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });
    });
});

module.exports = app;