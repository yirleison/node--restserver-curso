var express = require('express');
var app = express();
let userController = require('../controller/user');

app.post('/usuario', userController.saveUser);



module.exports = app;