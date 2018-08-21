var express = require('express');

var app = express();

// Rutas
// Las rutas reciben 3 callbacks (request, response, next)
// el next le indica a express que ejecute la siguiente instrucción
// por lo general next se utiliza en los middlewares
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });
});

module.exports = app;