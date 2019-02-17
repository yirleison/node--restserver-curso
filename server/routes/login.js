let bcrypt = require('bcryptjs');
const _ = require('underscore');
let User = require('../models/user');
const jwt = require('jsonwebtoken');
//libreria de google para validar el token expedido por google en nuestra app.
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//verify().catch(console.error);
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(
            e => {
                return res.status(403).send({
                    ok: false,
                    err: e
                })
            });

    if (googleUser != undefined) {
        User.findOne({ email: googleUser.email }, (err, userDB) => {

            if (err) {
                return res.status(500).send({ ok: false, err });
            }

            if (userDB) {
                //Valido si es un usuario autenticado por google...
                if (userDB.google === false) {
                    return res.status(400).send(
                        {
                            ok: false,
                            err: { message: 'Debe autenticarse con las credenciales normales!!' }
                        });
                }
                else {
                    let token = jwt.sign(
                        {
                            usuario: userDB
                        }, process.env.SECRET_KEY,
                        {
                            expiresIn: process.env.CADUCIDAD_TOKEN

                        }
                    );
                    res.json({ ok: true, user: userDB, token: token });
                }

            }
            else {
                //Si el usuario no existe en la DB, procedo a crearlo con los datos de google
                let user = new User({
                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    igm: googleUser.img,
                    google: true,
                    password: ':)'
                });

                user.save((err, userDB) => {
                    if (err) {
                        return res.status(400).send({ ok: false, err });
                    }

                    res.send({ ok: true, usuario: userDB });
                });
            }
        });
    }
    else {
        return res.status(400).send({ message: 'El token de la solicitud es invalido' });
    }


})


module.exports = app;