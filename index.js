'use strict'
const express = require('express');

var mongoose = require('mongoose');
var app = require('./App');
const port = express();

const database = "Colosus_db";
const password = "666JyzE3nEK.UDx";
const URI = 'mongodb+srv://StarFiveTeam:'+password+'@akasha-db.cpnnt.mongodb.net/'+database+'?retryWrites=true&w=majority';

port.set('port', process.env.PORT || 3000)


mongoose.set('useFindAndModify', false); //DESACTIVA LOS METODOS ANTIGUOS DE CONEXIÓN
mongoose.Promise = global.Promise; //ESTABLECE LA PROMESA GLOBAL

//REALIZA LA CONEXION DE LA BD CON NODE.JS
// mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useUnifiedTopology: true, useNewUrlParser: true}) // SERVICIO LOCAL
mongoose.connect(URI)  // SERVICIO ATHLAS
        .then(() => {
            console.log('La conexión con MongooDB se establecio en forma Exitosa!!!');

            // CREAR EL SERVIDOR Y ESCUCHAR PETICIONES:
            app.listen(port.get('port'), () =>{
                console.log('Servidor corriendo en:Https://technology-blog-njs.herokuapp.com:'+port.get('port')); // SERVICIO ON-LINE
                //console.log('Servidor corriendo en: Http://localhost:'+port); // SERVICIO LOCAL
            });

        })
        .catch(err => console.log(err));