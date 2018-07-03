var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');

var Marca = require('../models/marca');


// *****************************************
//      Obtener todas las marcas
// *****************************************
app.get('/', (req, res) => {

    Marca.find({})
        .sort({ nombre: 'asc' })
        .exec((err, marcas) => {

            if( err ) {
                return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar marcas',
                errors: err
            });
            }
            
            res.status(200).json({
                ok: true,
                marcas: marcas
            });
            

        });

});


// *****************************************
//      Agregar una marca
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var marca = new Marca();
    marca.nombre = body.nombre;

    marca.save( (err, marcaSaved) => {

        if( err ) {
            return res.status(400).json({
               ok: false,
               mensaje: 'Marca existente',
               errors: err
           });
        }
        
        res.status(201).json({
            ok: true,
            marca: marcaSaved
        });
        

    });
    

});

module.exports = app;
