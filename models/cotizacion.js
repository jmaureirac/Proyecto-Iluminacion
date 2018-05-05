'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CotizacionSchema = Schema({
  created_at: String,
  user: { type: Schema.ObjectId, ref: 'User' }
  productos : [{
 	type: Schema.ObjectId, ref: 'Product',
	cantidad : int
   }]
});

module.exports = mongoose.model('Cotizacion', CotizacionSchema);
