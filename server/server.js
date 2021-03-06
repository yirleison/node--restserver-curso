require('./config/config');
var express = require('express');
var app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
let consola = console.log;

//Habilitar la carpeta public
app.use(express.static(path.resolve( __dirname, '../public')));
 // importamos las rutas

 app.use( require('./routes/index') );

mongoose.connect(process.env.URLDB, (err, res) => {
  if (err) {
    throw err;
  } 
  consola('La base de datos ha sido conectada exitosamente');
}); 
app.listen(process.env.PORT, () => {
    consola('Escuchando en el puerto', process.env.PORT);
})