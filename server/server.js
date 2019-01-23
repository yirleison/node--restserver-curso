require('./config/config');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

let consola = console.log;
 
app.get('/', function (req, res) {
  res.send({saludo: "Hola Yirleison"});
})
 
app.listen(process.env.PORT, ()=>{
    consola('Escuchando en el puerto', 3000);
})