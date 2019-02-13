const mongoose = require('mongoose');
const mongoValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values : ['USER_ROLE','ADMIN_ROLE'],
    message : '{VALUE} no es un rol válido'
};

let userSquema = new Schema({
    nombre : {
        type: String,
        required : [true, 'El nombre es necesario']
    },
    email : {
        type : String,
        required : [true, 'La contrasña es obligatoria'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'la contrseña es obligatoria']
    },
    img : {
        type : String,
        required : false
    },
    role : {
        type : String,
        default : 'USER_ROLE',
        enum : rolesValidos //Sirve para aplicar una validación o validaciondes personalizadas
    },
    estado : {
        type : Boolean,
        default : true,
        required : false
    },
    google : {
        type : Boolean,
        default : false
    }
});

/**
 *  Lo que hacemos con userSquema.methods.toJSON = function() es acceder al objeto de ese usuario
 *  y asi poder modificarlo ya que lo que lo convertimos en unobjects. Al schema le podemos asignar métodos
 * */ 
userSquema.methods.toJSON = function() {
    let us = this;
    let userObject = us.toObject();
    delete userObject.password;

    return userObject;
}

userSquema.plugin(mongoValidator, {message:'{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', userSquema);