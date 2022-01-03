'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//Configurar el modulo Connect Multiparty: router/article.js
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles'});


//Rutas de Servicio
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;