var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var categoriaSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    }
},{
    collection: 'categorias'
});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('Categoria', categoriaSchema);
