const fileUpload = require('express-fileupload');
let express = require('express');
let app = express();
let User = require('../models/user');
let Product = require('../models/producto.model');
const fs = require('fs');
const path = require('path');

var moment = require('moment');

app.use(fileUpload());
uploapFile = (req, res) => {

    var tipo = req.params.tipo;
    let id = req.params.id;
    let tipos_validos = ['productos', 'usuarios'];

    if (tipos_validos.indexOf(tipo) < 0) {

        return res.status(400).send(
            {
                ok: false,
                err: {
                    message: `Los tipos permitidos son: ${tipos_validos.join(', ')}`
                }

            });
    }
    if (!req.files) {
        return res.status(400).send(
            {
                ok: false,
                err: {
                    message: 'No se seleccionado ningún archivo'
                }

            });
    }

    let archivo = req.files.archivo;

    //valido la extensión del archivo...
    let ext_file = ['png', 'jpg', 'jpge', 'mpge', 'mpg', 'gif'];

    let ext_type = archivo.name.split('.')[1];
    
    if (ext_file.indexOf(ext_type) < 0) {

        return res.status(400).send(
            {
                ok: false,
                err: {
                    message: `formato de archivo ${archivo.name} no valido, extensiones permitidas son ${ext_file.join(', ')}`
                }

            });
    }
    else {
        //Use the mv() method to place the file somewhere on your server
        //cambiar el nombre al archivo



        let nombre_archivo = `${id}-${new Date().getMilliseconds()}.${ext_type}`
        
        archivo.mv(`uploads\\${tipo}\\${nombre_archivo}`, function (err) {
            if (err)
                return res.status(500).send(
                    {
                        ok: false,
                        err: {
                            message: 'No se pudo subir el archivo archivo',
                            err
                        }

                    });
        });
       
         tipo === 'usuarios' ? imagenUsuario(id, res, nombre_archivo) : imagenProducto(id, res, nombre_archivo);
    }
}

imagenUsuario = (id, res, nombre_archivo) => {

    User.findById(id, (err, userDB) => {
   
        if (err)

            return res.status(500).send(
                {
                    ok: false,
                    err: {
                        message: 'Ha ocurrido un error en el servidor',
                        err
                    }

                })

        if (!userDB) {
            return res.status(400).send(
                {
                    ok: false,
                    err: {
                        message: `No se encontraro una imagen en la DB`,
                    }
                })
        }

        borraArchivo(userDB.img, 'usuarios');

        userDB.img = nombre_archivo;

        userDB.save((err, userSaved) => {
            if (err)

                return res.status(500).send(
                    {
                        ok: false,
                        err: {
                            message: 'Ha ocurrido un error en el servidor',
                            err
                        }

                    })
            if (!userSaved) {
                return res.status(400).send(
                    {
                        ok: false,
                        err: {
                            message: 'No se pudo actualizar la imagen',
                        }
                    });
            }
            else {
                return res.status(200).send(
                    {
                        ok: true,
                        err: {
                            usuario: userSaved,
                            img: nombre_archivo
                        }
                    })
            }
        });

    });
}


imagenProducto = (id, res, nombre_archivo) => {

        Product.findById(id, (err, productDB) => {

            if (err)

                return res.status(500).send(
                    {
                        ok: false,
                        err: {
                            message: 'Ha ocurrido un error en el servidor',
                            err
                        }

                    })

            if (!productDB) {
                return res.status(400).send(
                    {
                        ok: false,
                        err: {
                            message: 'No se encontro un producto en la DB',
                        }
                    })
            }
    
            borraArchivo(productDB.img, 'productos');

            productDB.img = nombre_archivo;

            productDB.save((err, productSaved) => {
                if (err)

                    return res.status(500).send(
                        {
                            ok: false,
                            err: {
                                message: 'Ha ocurrido un error en el servidor',
                                err
                            }

                        })
                if (!productSaved) {
                    return res.status(400).send(
                        {
                            ok: false,
                            err: {
                                message: 'No se pudo actualizar la producto',
                            }
                        });
                }
                else {
                    return res.status(200).send(
                        {
                            ok: true,
                            err: {
                                usuario: productSaved,
                                img: nombre_archivo
                            }
                        })
                }
            });

        });
}

borraArchivo = (url_imagen, tipo_usuario) => {

    let patImg = path.resolve(__dirname, `../../uploads/${tipo_usuario}/${url_imagen}`);

    if (fs.existsSync(patImg)) {
        fs.unlinkSync(patImg);
    }
}

getImage = (req, res ) => {

    var tipo = req.params.tipo;
    let img = req.params.img;

    let patImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(patImg)) {
        res.sendFile(path.resolve(patImg));
    }
}

module.exports = {
    uploapFile,
    imagenUsuario,
    imagenProducto,
    getImage
}