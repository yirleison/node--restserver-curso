var express = require('express');
var app = express();


app.use( require('./user') );
app.use( require('./login') );
app.use( require('./categoria.router') );
app.use( require('./producto.route') );
app.use( require('./upload.route') );

module.exports = app;