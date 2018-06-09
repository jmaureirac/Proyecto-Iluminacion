var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var marcaSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    }
},{
    collection: 'marcas'
});

marcaSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('Marca', marcaSchema);
