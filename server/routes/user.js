var express = require('express');
var app = express();
let userController = require('../controller/user');

app.post('/usuario', userController.saveUser);
app.put('/usuario/:id', userController.updateUser);
app.get('/usuario', userController.getUser);



module.exports = app;