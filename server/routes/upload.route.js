var express = require('express');
var app = express();
const fileUpload = require('express-fileupload');
let uploadService = require('../servicies/upload.service');

app.use(fileUpload());
app.put('/subir/archivo/:tipo/:id', uploadService.uploapFile);

module.exports = app;