var express = require('express');
var app = express();
const fileUpload = require('express-fileupload');
let uploadService = require('../servicies/upload.service');

app.put('/subir/archivo/:tipo/:id', uploadService.uploapFile);
app.get('/listar-imagen/:tipo/:img', uploadService.getImage);

module.exports = app;