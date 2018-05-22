var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var stockSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
        unique: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio_compra: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }

});

stockSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );


module.exports = mongoose.model('Stock', stockSchema);
