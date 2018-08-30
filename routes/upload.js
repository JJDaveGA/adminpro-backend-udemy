var express = require('express');
var fs = require('fs');
var fileUpload = require('express-fileupload');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

//express-fileupload middleware
app.use(fileUpload());

// Rutas
app.put('/:type/:id', (req, res) => {
    var type = req.params.type;
    var id = req.params.id;
    //Validamos tipo de colección
    var validTypes = ['users', 'hospitals', 'doctors'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de colección inválida',
            errors: { message: 'El tipo de colección es inválida' }
        });
    }
    //Si no hay imagenes regresamos un sts 400
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No ha seleccionado ninguna imagen',
            errors: { message: 'No ha cargado ninguna imagen' }
        });
    }
    //Obtenemos nombre del archivo
    var file = req.files.image;
    var arrFile = file.name.split('.');
    var fileExt = arrFile[arrFile.length - 1];
    //Validación de extensiones
    var arrExtAllowed = ['png', 'jpg', 'jpeg', 'gif'];
    if (arrExtAllowed.indexOf(fileExt) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + arrExtAllowed.join(', ') }
        });
    }
    //Nombre de archivo personalizado
    var fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
    //Mover archivo de tmp a una ruta en específico
    var path = `./uploads/${type}/${fileName}`;
    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }
    });

    uploadByType(type, id, fileName, res);

    /*res.status(200).json({
        ok: true,
        message: fileExt
    });*/
});

function uploadByType(type, id, fileName, res) {
    if (type === 'users') {
        User.findById(id, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al obtener imagen de usuario',
                    errors: err
                });
            }
            var oldPath = `./uploads/${type}/${user.img}`;
            //Si existe la imagen anterior la elimina
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            user.img = fileName;
            user.save((err, userUpdated) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al cargar imagen',
                        errors: err
                    });
                }
                userUpdated.password = '';
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    user: userUpdated
                });
            });
        });
    }
    if (type === 'doctors') {
        Doctor.findById(id, (err, doctor) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al obtener imagen del médico',
                    errors: err
                });
            }
            var oldPath = `./uploads/${type}/${doctor.img}`;
            //Si existe la imagen anterior la elimina
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            doctor.img = fileName;
            doctor.save((err, doctorUpdated) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al cargar imagen',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen del médico actualizada',
                    doctor: doctorUpdated
                });
            });
        });
    }
    if (type === 'hospitals') {
        Hospital.findById(id, (err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al obtener imagen del hospital',
                    errors: err
                });
            }
            var oldPath = `./uploads/${type}/${hospital.img}`;
            //Si existe la imagen anterior la elimina
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            hospital.img = fileName;
            hospital.save((err, hospitalUpdated) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al cargar imagen',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen del hospital actualizada',
                    hospital: hospitalUpdated
                });
            });
        });
    }
}

module.exports = app;