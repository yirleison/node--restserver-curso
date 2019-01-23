const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSquema = new Schema({
    nombre : {
        type: String,
        required : [true, 'El nombre es necesario']
    },
    email : {
        type : String,
        required : [true, 'La contrasña es obligatoria']
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
        default : 'USER_ROLE'
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

module.exports = mongoose.model('Usuario', userSquema);