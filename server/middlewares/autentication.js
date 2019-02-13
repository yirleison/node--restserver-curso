
/***********************************
  **********************************
  *                                *  
*   *      Verificar Token       *   *
  *                                *
  **********************************
 ***********************************/

const jwt = require('jsonwebtoken');

 let verifiToken = (req, res, next) => {
    let token = req.get('Authorization');

    if(!token) {
        return res.status(400).send({ message: 'El campo de Autorizacion es requerido' });
    }
    //var token = req.params.Authorization;
    //token = token.str.replace(/['"]+/g, '');

    jwt.verify(token, process.env.SECRET_KEY, (err, tk_decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Token invalido o expirado' });
        }
        req.usuario = tk_decoded.usuario;
        next();
    });
    
 };

 //===================================
//Validate Rol User
//===================================

let verify_user_admin = (req, res, next) => {
    let user = req.usuario;
    if(user.role !== 'ADMIN_ROLE') {
        return res.status(401).send({ message: 'Solo el usuario admin esta autorizado para ejecutar esta acción' });
    }
    next();
 };

 module.exports = {
    verifiToken,
    verify_user_admin
 }