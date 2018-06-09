var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');   

var Schema = mongoose.Schema;

var subcategoriaSchema = Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'El nombre es necesario']
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  }
},{
  collection: 'subcategorias'
});

subcategoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('Subcategoria', subcategoriaSchema);
