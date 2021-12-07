'use strict'

var mongoose = require('mongoose');
var app = require('./App');
var port = 3900;

const database = "Colosus_db";
const password = "666JyzE3nEK.UDx";
const URI = 'mongodb+srv://StarFiveTeam:'+password+'@akasha-db.cpnnt.mongodb.net/'+database+'?retryWrites=true&w=majority';


mongoose.set('useFindAndModify', false); //DESACTIVA LOS METODOS ANTIGUOS DE CONEXIÓN
mongoose.Promise = global.Promise; //ESTABLECE LA PROMESA GLOBAL

//REALIZA LA CONEXION DE LA BD CON NODE.JS
// mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useUnifiedTopology: true, useNewUrlParser: true}) // SERVICIO LOCAL
mongoose.connect(URI)  // SERVICIO ATHLAS
        .then(() => {
            console.log('La conexión con MongooDB se establecio en forma Exitosa!!!');

            // CREAR EL SERVIDOR Y ESCUCHAR PETICIONES:
            app.listen(port, () =>{
                //console.log('Servidor corriendo en:https://technology-blog.netlify.app:'+port); // SERVICIO ON-LINE
                console.log('Servidor corriendo en: Http://localhost:'+port); // SERVICIO LOCAL
            });

        })
        .catch(err => console.err(err));