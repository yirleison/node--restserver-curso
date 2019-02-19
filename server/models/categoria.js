const mongoose = require('mongoose');
const mongoValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categiraSchema = new Schema({

    descripcion: {
        type: String,
        unique: [true],
        required: [true, 'Este campo es obligatorio'],
    },
    estado :{
        type: Boolean,
        default: true,
        required : false
    },
    usuario: { type: Schema.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categiraSchema);