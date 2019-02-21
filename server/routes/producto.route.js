var express = require('express');
var app = express();
const fileUpload = require('express-fileupload');
let productoController = require('../controller/producto.controller');
const { verifiToken, verify_user_admin } = require('../middlewares/autentication');
let uploadService = require('../servicies/upload.service');

app.use(fileUpload());

app.post('/producto',[verifiToken], productoController.productSave);
app.get('/productos',[verifiToken], productoController.getProducts);
app.get('/producto/:id',[verifiToken], productoController.getProduct);
app.put('/producto/:id',[verifiToken], productoController.productUpdate);
app.put('/estado-producto/:id',[verifiToken], productoController.updateStatus);
app.put('/producto/upload/:tipo/:id',uploadService.uploapFile);


module.exports = app;