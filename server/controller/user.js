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

}

updateUser = (req, res) => {
    let id = req.params.id;
    //pick regresa una copia del objeto, filtrando solo por los valores que yo le indique
    let body = _.pick(req.body.body, ['nombre', 'email', 'img', 'role', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userUpdate) => {
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


    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let estado = req.query.estado;
  
    if(estado){
        var find = User.find({estado: estado}, 'nombre email role estado google img');
    }
    else if(!estado) {
        var find = User.find({}, 'nombre email role estado google img');
    }
    else {
         find = User.find({'estado': true}, 'nombre email role estado google img');
    }
     find.skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).send({ ok: false, err })
            }
            if(estado) {
                User.count({estado}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
            }
            else {
                User.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
            }
          
        })
}

userDelete = (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, userDelete) => {
        if (err) {
            return res.status(400).send({ ok: false, err })
        }
        if (!userDelete) {
            return res.status(400).send(
                { 
                    ok: false,
                    err : {
                        message : 'No se encontro un usuario'
                    }

                })
        }
        res.json({
            ok: true,
            usuario : userDelete
        })
    })
}

updateStatus = (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado : false
    }
    User.findByIdAndUpdate(id, cambiaEstado, {new : true}, (err, userStatus) => {
        if (err) {
            return res.status(400).send({ ok: false, err })
        }
        if (!userStatus) {
            return res.status(400).send(
                { 
                    ok: false,
                    err : {
                        message : 'No se pudo actualizar el estado'
                    }

                })
        }
        res.json({
            ok: true,
            usuario : userStatus
        })
    })
}

module.exports = {
    saveUser,
    updateUser,
    getUser,
    userDelete,
    updateStatus
}