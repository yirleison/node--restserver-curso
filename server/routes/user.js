var express = require('express');
var app = express();
let userController = require('../controller/user');
const { verifiToken, verify_user_admin } = require('../middlewares/autentication');

app.post('/usuario',[verifiToken, verify_user_admin], userController.saveUser);
app.put('/usuario/:id',[verifiToken, verify_user_admin], userController.updateUser);
app.get('/usuario', userController.getUser);
app.delete('/usuario/:id',[verifiToken, verify_user_admin], userController.userDelete);
app.put('/update-usuario/:id',[verifiToken, verify_user_admin], userController.updateStatus);



module.exports = app;