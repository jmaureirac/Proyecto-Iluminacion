var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cotizacionSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es necesario']
  },
  productos: [{
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
      },
	    cantidad: Number
  }],
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
},{
  collection: 'cotizaciones'
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);
