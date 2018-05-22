var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var productoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategoria',
        unique: true,
        required: [true, 'El producto pertenece a una subcategoria']
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        unique: true,
        required: [true, 'El producto tiene una marca']
    },
    descripción: {
        type: String,
        required: false
    },
    material: {
        type: String,
        required: false
    },
    precio_unitario: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    temperatura: {
        type: Number,
        required: false
    },
    vida_util: {
        type: Number,
        required: false
    },
    voltaje: {
        type: Number,
        required: false
    },
    potencia: {
        type: Number,
        required: false
    },
    flujo_luminoso: {
        type: Number,
        required: false
    },
    grado_proteccion: {
        type: Number,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    medidas: {
        ancho: Number,
        largo: Number,
        altura: Number,
        required: false
    }

},{
    collection: 'productos'
});

productoSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('Producto', productoSchema);
