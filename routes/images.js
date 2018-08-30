var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

// Rutas
app.get('/:type/:img', (req, res, next) => {
    var type = req.params.type;
    var img = req.params.img;
    //Creamos el path de la imagen con la librería path de NodeJS
    var pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

module.exports = app;