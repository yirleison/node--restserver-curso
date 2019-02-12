var express = require('express');
var app = express();


app.use( require('./user') );
app.use( require('./login') );

module.exports = app;