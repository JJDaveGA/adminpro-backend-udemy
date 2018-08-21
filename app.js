// Requires
var express = require('express');
var mongoose = require('mongoose');

// Importar Rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// Inicializar variables
var app = express();

// Body-Parser
var bodyParser = require('body-parser');
// Parsear application/x-www-form-urlencoded a json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Conexión MongoDB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Server: \x1b[34m%s\x1b[0m', 'online');
});

// Escuchar - puerto del servidor
app.listen(4000, () => {
    console.log('Express server is running on port 3000: \x1b[34m%s\x1b[0m', 'online');
});