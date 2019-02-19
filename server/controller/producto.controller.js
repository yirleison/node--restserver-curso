let Producto = require('../models/producto.model');
const _ = require('underscore');
let producto = new Producto;
let consola = console.log;


productSave = (req, res) => {
    let params = req.body;

    let producto = new Producto({
        nombre: params.nombre,
        precioUni: params.precioUni,
        descripcion: params.descripcion,
        categoria: params.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!productoDB) {
            return res.status(400).send(
                {
                    ok: false,
                    err: {
                        message: 'No se encontro un producto'
                    }

                });
        }

        res.status(200).send({ ok: true, producto: productoDB });
    });
}

getProducts = (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Producto.find({}).populate({ path: 'categoria' })
        .populate({ path: 'usuario' })
        .skip(desde)
        .limit(limite)
        .exec(function (err, products) {
            if (err) {
                return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
            }
            Producto.count((err, cuantos) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
                }
                res.json({
                    ok: true,
                    productos: products,
                    cuantidad: cuantos
                })
            })
        });
}

getProduct = (req, res) => {

    let id = req.params.id;

    Producto.findById({ _id: id })
        .populate({ path: 'categoria' })
        .populate({ path: 'usuario' })
        .exec(function (err, product) {
            if (err) {
                return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
            }
            res.json({
                ok: true,
                product: product
            })
        });
}

productUpdate = (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true },(err, productoDB) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!productoDB) {
            return res.status(400).send(
                {
                    ok: false,
                    err: {
                        message: 'No se pudo actualizar el producto'
                    }

                });
        }

        res.status(200).send({ ok: true, producto: productoDB });
    });
}

updateStatus = (req, res) => {
    let id = req.params.id;
    consola(id);
    let cambiaEstado = {
        disponible : req.body.disponible
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, {new : true}, (err, productStatus) => {
        if (err) {
            return res.status(500).send({ ok: false, message: 'Ha ocurrido un error en el servidor' });
        }
        if (!productStatus) {
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
            estado : productStatus.disponible
        })
    })
}

module.exports = {
    productSave,
    getProducts,
    getProduct,
    productUpdate,
    updateStatus
}