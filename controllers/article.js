'use strict'

const { query } = require('express');
var validator = require('validator');
var Article = require('../models/article');

//Iportamos librerias para manejo de ficheros:
var fs = require('fs');
var path = require('path');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Luis Enrique Guerrero',
            url: 'http://luisenguerrero.netlify.app',
            hola
        });

    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de artículos'
        });
    },

    save: (req, res) => {
        //Recoger parametros por POST
        var params = req.body;

        //VALIDAR datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!!'
            });
        }

        if(validate_title && validate_content){

            //CREAR el Objeto a guardar
            var article = new Article();

            //Asignar Valores
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }

            //GUARDAR el artículo
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!!'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            

            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!!'
            });
        }
    },

    getArticles: (req, res) => {

        var query = Article.find({});
        
        var last = req.params.last;
        if(last || last != undefined) {
            query.limit(5);
        }

        //Find -  Buscar los artículos

        query.sort('-_id').exec((err, articles) => {
            
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los artículos!!!'
                });        
            }

            if(!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar!!!'
                });
        
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
    
        });

    },

    getArticle: (req, res) => {

        //Recoger el Id de la Url
        var articleId = req.params.id;

        //Comprobar que existe 
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!!'
            });
        }

        //Buscar el articulo 
        Article.findById(articleId, (err, article) => {

            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!!'
                });
            };

            //Devolver en .JSON
            return res.status(200).send({
                status: 'success',
                article
            });


        });

    },

    update: (req, res) => {
        //Recoger el id del articulo por la url
        var articleId = req.params.id;

        //Recoger los datos que llegan del PUT
        var params = req.body;

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar!!!'
            });

        }

        if (validate_title && validate_content) {
            //Find and Update
            Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al Actualizar!!!'
                       });
            
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'NO Existe el articulo!!!'
                        });
            
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
        
            });

        }else {
            //Devolver Respuesta
            return res.status(500).send({
                status: 'error',
                message: 'La Validación NO es Correcta!!!'
            });

        }
    },

    delete: (req, res) => {
        //Recoger el id de la Url
        var articleId = req.params.id;

        //Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al Borrar!!!'
                    });
                                
                }
                if (!articleRemoved) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'NO se ha borrado el artículo, Posiblemente NO Exista!!!'
                    });
            
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleRemoved
                });        

        });
       
    },

    upload: (req, res) => {
        //Configurar el modulo Connect Multiparty: router/article.js (CONFIGURADO OK)

        //Recojer el fichero de la petición
        var file_name = 'imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
    
        }

        //Conseguir nombre y extensión del archivo
        var file_path = req.files.file0.path;
        //var file_split = file_path.split('\\'); //Solo para Windows
        
        //** ADVERTENCIA ** Utilizar en LINUX O MAC:
        var file_split = file_path.split('/');

        //Nombre del archivo:
        var file_name = file_split[2];
        
        //Extensión del fichero:
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        
        //Comprobar Si la extensión es sólo una imagen, sino borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // BORRAR el fichero subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La Extensión de la imagen no es válida!!!'
                }); 

            })
        } else {
            //Si todo es válido, sacar id de la Url:
            var articleId = req.params.id;

            if(articleId){
                //Buscar el artículo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del articulo!!!'
                        }); 
       
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
        
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });

            }
           
        }

    },// End upload file

    getImageNew: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        open(path_file, 'r', (err, file) => {
            if (err) {
              if (err.code === 'ENOENT') {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen NO existe!!!'
                }); 
              }          
              throw err;
            }

            try {
                return res.sendFile(path.resolve(path_file));
            } finally {
              close(file, (err) => {
                if (err) throw err;
              });
            }
          });
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
       
        fs.access(path_file, fs.F_OK, (err) => {
            
            if(!err) {
                return res.sendFile(path.resolve(path_file));
            }else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen NO existe!!!'
                }); 

            }
        });

    },

    search: (req, res) => {
        //Sacar la cadena a buscar: 
        var searchString = req.params.search;

        //Find of
        Article.find ({"$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la Petición!!!'
                });                         
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos que coincidan con la búsqueda!!!'
                }); 
        
            }
            return res.status(200).send({
                status: 'success',
                articles
            }); 
    
        })

    }
};  // END CONTROLLER

module.exports = controller;