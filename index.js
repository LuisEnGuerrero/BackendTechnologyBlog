'use strict'

var mongoose = require('mongoose');
var app = require('./App');
var port = 3900;

mongoose.set('useFindAndModify', false); //DESACTIVA LOS METODOS ANTIGUOS DE CONEXIÓN
mongoose.Promise = global.Promise; //ESTABLECE LA PROMESA GLOBAL

//REALIZA LA CONEXION DE LA BD CON NODE.JS
mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useUnifiedTopology: true, useNewUrlParser: true})
        .then(() => {
            console.log('La conexión con MongooDB se establecio en forma Exitosa!!!');

            // CREAR EL SERVIDOR Y ESCUCHAR PETICIONES:
            app.listen(port, () =>{
                console.log('Servidor corriendo en: Http://localhost:'+port);
            });

        });