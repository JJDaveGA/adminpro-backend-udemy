// Requires
var express = require('express');
var mongoose = require('mongoose');

// Importar Rutas
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');

// Inicializar variables
var app = express();

// Body-Parser
var bodyParser = require('body-parser');
// Parsear application/x-www-form-urlencoded a json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use('/', appRoutes);
app.use('/login', loginRoutes);
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagesRoutes);

// Conexión MongoDB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Server: \x1b[34m%s\x1b[0m', 'online');
});

// Escuchar - puerto del servidor
app.listen(4000, () => {
    console.log('Express server is running on port 3000: \x1b[34m%s\x1b[0m', 'online');
});