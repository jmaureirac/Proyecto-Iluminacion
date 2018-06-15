var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');


var Categoria = require('../models/categoria');


// *****************************************
//      Obtener todas las categorias
// *****************************************
app.get('/', mdAuth.verificaToken, (req, res) => {

    Categoria.find({})
        .sort({ nombre: 'asc' })
        .exec((err, categorias) => {

            if( err ) {
                return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar categorias',
                errors: err
            });
            }
            
            res.status(200).json({
                ok: true,
                categorias: categorias
            });
            

        });

});


// *****************************************
//      Obtener una categoria por id
// *****************************************
app.get('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar categoria',
                    errors: err
                });
            }
            if ( !categoria ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Categoria inexistente',
                    errors: {
                        message: 'No existe categoria con ese id'
                    }
                });
            }
            
            res.status(200).json({
                ok: true,
                categoria: categoria
            });
            

        });

});


// *****************************************
//      Agregar una categoria
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var categoria = new Categoria();
    categoria.nombre = body.nombre;

    categoria.save( (err, categoriaSaved) => {

        if( err ) {
            return res.status(400).json({
               ok: false,
               mensaje: 'Categoría existente',
               errors: err
           });
        }
        
        res.status(201).json({
            ok: true,
            categoria: categoriaSaved
        });
        

    });
    

});



module.exports = app;
