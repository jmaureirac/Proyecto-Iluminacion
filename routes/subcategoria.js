var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');


var Subcategoria = require('../models/subcategoria');

// *****************************************
//      Obtener todas las subcategorias
// *****************************************
app.get('/', (req, res) => {

    Subcategoria.find({})
        .sort({ nombre: 'asc' })
        .populate('categoria')
        .exec((err, subcategorias) => {

            if( err ) {
                return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar subcategorias',
                errors: err
            });
            }
            
            res.status(200).json({
                ok: true,
                subcategorias: subcategorias
            });
            

        });

});


// *****************************************
//      Obtener una categoria por id
// *****************************************
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Subcategoria.findById(id)
        .populate('categoria')
        .exec((err, subcategoria) => {
        
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar subcategoria',
                errors: err
            });
        }
        if ( !subcategoria ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Subcategoria inexistente',
                errors: {
                    message: 'No existe subcategoria con ese id'
                }
            });
        }
        
        res.status(200).json({
            ok: true,
            subcategoria: subcategoria
        });
        
        
    }); 
});


// *****************************************
//      Agregar una subcategoria
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var subcategoria = new Subcategoria();
    subcategoria.nombre = body.nombre;
    subcategoria.categoria = body.categoria;

         
    subcategoria.save( (err, subcategoriaSaved) => {
        
        if( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Subcategoría existente',
                errors: err
            });
        }
        
        res.status(201).json({
            ok: true,
            subcategoria: subcategoriaSaved
        });
        
    });
            
});



// *****************************************
//      Actualizar subcategoria
// *****************************************
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Subcategoria.findById(id, (err, subcategoriaDB) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar subcategoria',
               errors: err
           });
        }
        
        if( !subcategoriaDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Subcategoria inexistente',
                errors: {
                    message: 'No existe subcategoria'
                }
            });
        }

        
        subcategoriaDB.nombre = body.nombre;
        subcategoriaDB.categoria = body.categoria;


        subcategoriaDB.save((err, subcategoriaSaved) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al actualizar subcategoria',
                   errors: err
               });
            }
            if( !subcategoriaSaved ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar subcategoria',
                    errors: {
                        message: 'Categoria ya existe '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                subcategoria: subcategoriaSaved
            });            
            
        });

    });

});



// *****************************************
//      Eliminar subcategoria
// *****************************************
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Subcategoria.findByIdAndRemove(id, (err, subcategoriaDeleted) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al eliminar subcategoria',
               errors: err
           });
        }
        
        if( !subcategoriaDeleted ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Subcategoria inexistente',
                errors: {
                    message: 'No existe subcategoria'
                }
            });
        }

        res.status(200).json({
            ok: true,
            subcategoria: subcategoriaDeleted
        });
        

    });

});



module.exports = app;
