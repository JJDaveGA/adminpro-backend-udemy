var express = require('express');

var app = express();

// Importamos los Schemas
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Rutas

// ============================================
// GET: Búsqueda general
// ============================================
app.get('/all/:search', (req, res) => {
    var search = req.params.search;
    var regex = new RegExp(search, 'i');
    //ES6 -> Promise All
    Promise.all([
        searchHospitals(search, regex),
        searchDoctors(search, regex),
        searchUsers(search, regex)
    ]).then(responses => {
        res.status(200).json({
            ok: true,
            hospitals: responses[0] || [],
            doctors: responses[1] || [],
            users: responses[2] || []
        });
    });
});

// ============================================
// GET: Búsqueda específica
// ============================================
app.get('/collection/:collection/:search', (req, res) => {
    var collection = req.params.collection;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');
    var promise;
    switch (collection) {
        case 'users':
            promise = searchUsers(search, regex);
            break;
        case 'hospitals':
            promise = searchHospitals(search, regex);
            break;
        case 'doctors':
            promise = searchDoctors(search, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de búsqueda sólo son usuarios, médicos y hospitales',
                error: { message: 'Tipo de colección no válida' }
            });
    }
    promise.then(data => {
        res.status(200).json({
            ok: true,
            [collection]: data
        });
    });
});

function searchHospitals(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
}

function searchDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, doctors) => {
                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(doctors);
                }
            });
    });
}

function searchUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{ name: regex }, { email: regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = app;