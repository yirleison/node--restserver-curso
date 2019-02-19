var express = require('express');
var app = express();
let categoriaController = require('../controller/categoria.controller');
const { verifiToken, verify_user_admin } = require('../middlewares/autentication');

app.post('/categoria',[verifiToken], categoriaController.saveCategorie);
app.get('/categoria',[verifiToken], categoriaController.getCategorie);
app.put('/categoria/:id',[verifiToken], categoriaController.updateCategorie);
app.delete('/categoria/:id',[verifiToken], categoriaController.categorieDelete);
app.put('/estado/:id',[verifiToken], categoriaController.updateStatus);

module.exports = app;