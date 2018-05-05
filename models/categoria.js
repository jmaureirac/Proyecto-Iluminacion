'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CategoriesSchema = Schema({
{ 
   nombre: String,
   subcategoria:{ type: Schema.ObjectId, ref: 'Subcategoria' }
});

module.exports = mongoose.model('Categories', CategoriesSchema);
