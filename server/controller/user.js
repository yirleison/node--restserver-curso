let User = require('../models/user');
let bcrypt = require('bcryptjs');
const _ = require('underscore');

let user = new User();

let consola = console.log;

saveUser = (req, res) => {
    let params = req.body;

    let user = new User({
        nombre: params.nombre,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).send({ ok: false, err })
        }

        res.send({ ok: true, usuario: userDB });
    });

    consola(params);
}

updateUser = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body.body, ['nombre', 'email', 'img', 'role', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userUpdate) => {
        consola('enro update');
        if (err) {
            return res.status(400).send({ ok: false, err })
        }

        res.json({
            ok: true,
            usuario: userUpdate
        })
    });
}

getUser = (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).send({ ok: false, err })
            }

            User.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos : conteo
                })
            })
        })
}

module.exports = {
    saveUser,
    updateUser,
    getUser
}