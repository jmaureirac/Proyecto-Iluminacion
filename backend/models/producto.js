var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var productoSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategoria',
        required: [true, 'El producto pertenece a una subcategoria']
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: [true, 'El producto tiene una marca']
    },
    descripcion: {
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
        type: String,
        required: false
    },
    vida_util: {
        type: String,
        required: false
    },
    voltaje: {
        type: String,
        required: false
    },
    potencia: {
        type: String,
        required: false
    },
    flujo_luminoso: {
        type: String,
        required: false
    },
    grado_proteccion: {
        type: String,
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
