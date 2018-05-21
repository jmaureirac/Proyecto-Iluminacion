var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var productoSchema = Schema({
    nombre: {
        types: String,
        required: [true, 'El nombre es requerido']
    },
    subcategoria: {
        types: Schema.Types.ObjectId,
        ref: 'Subcategoria',
        unique: true,
        required: [true, 'El producto pertenece a una subcategoria']
    },
    marca: {
        types: Schema.Types.ObjectId,
        ref: 'Marca',
        unique: true,
        required: [true, 'El producto tiene una marca']
    },
    descripción: {
        types: String,
        required: false
    },
    material: {
        types: String,
        required: false
    },
    precio_unitario: {
        types: Number,
        required: [true, 'El precio es obligatorio']
    },
    temperatura: {
        types: Number,
        required: false
    },
    vida_util: {
        types: Number,
        required: false
    },
    voltaje: {
        types: Number,
        required: false
    },
    potencia: {
        types: Number,
        required: false
    },
    flujo_luminoso: {
        types: Number,
        required: false
    },
    grado_proteccion: {
        types: Number,
        required: false
    },
    img: {
        types: String,
        required: false
    },
    medidas: {
        ancho: Number,
        largo: Number,
        altura: Number,
        required: false
    },

},{
    collection: 'productos'
});

productoSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('Producto', productoSchema);
