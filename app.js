// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

//Conexión MongoDB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Server: \x1b[34m%s\x1b[0m', 'online');
});

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

// Escuchar - puerto del servidor
app.listen(4000, () => {
    console.log('Express server is running on port 3000: \x1b[34m%s\x1b[0m', 'online');
});