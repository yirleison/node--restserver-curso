require('./config/config');
var express = require('express');
var app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

let consola = console.log;
 
app.use( require('./routes/user') );

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
  if (err) {
    throw err;
  } 
  consola('La base de datos ha sido conectada exitosamente');
}); 
app.listen(process.env.PORT, () => {
    consola('Escuchando en el puerto', process.env.PORT);
})