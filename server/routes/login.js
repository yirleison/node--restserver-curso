let bcrypt = require('bcryptjs');
const _ = require('underscore');
let User = require('../models/user');
const jwt = require('jsonwebtoken');
var express = require('express');
var app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).send({ ok: false, err });
        }

        if (!userDB) {
            return res.status(400).send({ message: 'Usuario o contraseña invalidos' });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).send({ message: 'Usuario o contraseña invalidos' });
        }

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SECRET_KEY,
            { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({ ok: true, user: userDB, token: token });
    });

})


module.exports = app;