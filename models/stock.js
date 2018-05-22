var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stockSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        default: 0
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