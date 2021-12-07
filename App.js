'use strict' //CARGA EL MODO ESTRICTO DE JS

// CARGAR módulos de NODE para CREAR el Servidor
const express = require('express');  // Carga el módulo Express de Node.js que permite CREAR el Servidor
const bodyParser = require('body-parser'); // Recibe las peticiones y para convertirlas en .JSON

const cors = require('cors');

// EJECUTAR express PARA el trabajo con (HTTP)
const app = express(); // Es la Aplicación 

// CARGAR ficheros de RUTAS
const article_routes = require('./routes/article');

// CARGAR MiddLewares para la carga de FICHEROS
app.use(bodyParser.urlencoded({ extended: false })); // CARGA el bodyParser para utilizarlo
app.use(bodyParser.json()); // CONVIERTE toda petición entrante en .JSON


//Configuracion
app.set('port', process.env.PORT || 3000)
app.use(cors())
app.use(express.json())

const PORT = app.set('port', process.env.PORT || 3000)

// CARGAR CORS para permitir las llamadas desde el FRONTEND
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// AÑADIR prefijos a rutas. --> CARGAR rutas
app.use('/api', article_routes);

// EXPORTAR módulo (fichero actual)
module.exports = app;
