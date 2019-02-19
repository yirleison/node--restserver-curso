let Categoria = require('../models/categoria');
const _ = require('underscore');
let categoria = new Categoria;
let consola = console.log;

saveCategorie = (req, res) => {
    let params = req.body;

    let categoria = new Categoria({
        descripcion: params.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!categoriaDB) {
            return res.status(400).send(
                {
                    ok: false,
                    err: {
                        message: 'No se encontro una categoria'
                    }

                });
        }

        res.status(200).send({ ok: true, categoria: categoriaDB });
    });

}

getCategorie = (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let estado = req.query.estado;
  
    if(estado){
        var find = Categoria.find({estado: estado});
    }
    else if(!estado) {
        var find = Categoria.find({},['descripcion', 'estado']);
    }
    else {
         find = Categoria.find({'estado': true},['descripcion', 'estado']);
    }
     find.skip(desde)
        .limit(limite)
        .exec((err, categories) => {
            if (err) {
                return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
            }
            if(estado) {
                Categoria.count({estado}, (err, conteo) => {
                    res.json({
                        ok: true,
                        categories,
                        cuantos: conteo
                    })
                })
            }
            else {
                Categoria.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        categories,
                        cuantos: conteo
                    })
                })
            }
          
        })
}

updateCategorie = (req, res) => {
    let id = req.params.id;
    //pick regresa una copia del objeto, filtrando solo por los valores que yo le indique
    let body = _.pick(req.body.body, ['_id', 'descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categorieUpdate) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }

        res.json({
            ok: true,
            categoria: categorieUpdate
        })
    });
}

categorieDelete = (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categorieDelete) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!categorieDelete) {
            return res.status(400).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        res.json({
            ok: true,
            categoria : categorieDelete
        })
    })
}

updateStatus = (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado : req.body.estado
    }
    Categoria.findByIdAndUpdate(id, cambiaEstado, {new : true}, (err, categorieStatus) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!categorieStatus) {
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
            usuario : categorieStatus
        })
    })
}


module.exports = {
    saveCategorie,
    getCategorie,
    updateCategorie,
    categorieDelete,
    updateStatus
}

