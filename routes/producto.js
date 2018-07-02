var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');
var mdUser = require('../middlewares/user');

var Producto = require('../models/producto');


// *****************************************
//      Obtener Productos
// *****************************************
app.get('/', mdAuth.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .sort({ nombre: 'asc' })
        .populate('marca')
        .populate('subcategoria')
        .skip(desde)
        .limit(10)
        .exec((err, productos) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al buscar productos',
                   errors: err
               });
            }

            Producto.count({}, (err, cantidad) => {

                if( err ) {
                    return res.status(500).json({
                       ok: false,
                       mensaje: 'Error al contar productos',
                       errors: err
                   });
                }
                

                res.status(200).json({
                    ok: true,
                    productos: productos,
                    total: cantidad
                });
                
            });

        });

});


// *****************************************
//      Obtener Productos
// *****************************************
app.get('/all', mdAuth.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .sort({ nombre: 'asc' })
        .populate('marca')
        .populate('subcategoria')
        .exec((err, productos) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al buscar productos',
                   errors: err
               });
            }

            Producto.count({}, (err, cantidad) => {

                if( err ) {
                    return res.status(500).json({
                       ok: false,
                       mensaje: 'Error al contar productos',
                       errors: err
                   });
                }
                

                res.status(200).json({
                    ok: true,
                    productos: productos,
                    total: cantidad
                });
                
            });

        });

});


// *****************************************
//      Obtener producto por ID
// *****************************************
app.get('/:id', mdAuth.verificaToken, (req, res) =>{

    var id = req.params.id;

    Producto.findById( id )
        .populate('marca') 
        .populate('subcategoria')
        .exec( (err, producto) => {
        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al cargar producto',
               errors: err
           });
        }
        if( !producto ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar producto',
                errors: {
                    message: 'No existe producto con ese ID'
                }
            });
        }
        res.status(200).json({
            ok: true,
            producto
        }); 
    });
});


// *****************************************
//      Agregar Producto
// *****************************************
app.post('/', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        subcategoria: body.subcategoria,
        marca: body.marca,
        descripcion: body.descripcion,
        material: body.material,
        precio_unitario: body.precio_unitario,
        temperatura: body.temperatura,
        vida_util: body.vida_util,
        voltaje: body.voltaje,
        potencia: body.potencia,
        flujo_luminoso: body.flujo_luminoso,
        grado_proteccion: body.grado_proteccion,
        medidas: {
            largo: body.largo,
            altura: body.altura,
            ancho: body.ancho
        }
    });

    producto.save((err, productoSaved) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al guardar producto',
               errors: err
           });
        }
        if( !productoSaved ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Producto ya existe',
                errors: {
                    message: 'Producto existente'
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoSaved
        });
        
    });

});



// *****************************************
//      Actualizar producto
// *****************************************
app.put('/:id', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Producto.findById(id, (err, productoDB) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar producto',
               errors: err
           });
        }
        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Producto inexistente',
                errors: {
                    message: 'No existe producto con ese id'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.subcategoria = body.subcategoria;
        productoDB.marca = body.marca;
        productoDB.descripcion = body.descripcion;
        productoDB.material = body.material;
        productoDB.precio_unitario = body.precio_unitario;
        productoDB.temperatura = body.temperatura;
        productoDB.vida_util = body.vida_util;
        productoDB.voltaje = body.voltaje;
        productoDB.potencia = body.potencia;
        productoDB.flujo_luminoso = body.flujo_luminoso;
        productoDB.grado_proteccion = body.grado_proteccion;
        productoDB.medidas = body.medidas;

        productoDB.save((err, productoSaved) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al guardar producto',
                   errors: err
                });
            }
            if( !productoSaved ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Producto existente',
                    errors: {
                        message: 'Nombre de producto ya existe'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoSaved
            });
            

        });

    });


});



// *****************************************
//      Eliminar Producto
// *****************************************
app.delete('/:id', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoDeleted) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar producto',
               errors: err
           });
        }
        if( !productoDeleted ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Producto inexistente',
                errors: {
                    message: 'No existe el producto con ese id'
                }
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDeleted
        });
        
    });

});



module.exports = app;

