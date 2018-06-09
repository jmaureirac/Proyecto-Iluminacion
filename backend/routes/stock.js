var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');

var Stock = require('../models/stock');


// *****************************************
//      Ver productos en stock
// *****************************************
app.get('/', mdAuth.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Stock.find({})
        .populate('producto')
        .skip(desde)
        .limit(10)
        .exec((err, stocks) => {

            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al buscar productos',
                   errors: err
               });
            }
            if( !stocks ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No hay productos en stock',
                    errors: {
                        message: 'No existen productos con Stock en el inventario'
                    }
                });
            }
            
            Stock.count((err, cantidad) => {

                if( err ) {
                    return res.status(500).json({
                       ok: false,
                       mensaje: 'Error al contar productos',
                       errors: err
                   });
                }
                
                res.status(200).json({
                    ok: true,
                    stocks: stocks,
                    total: cantidad
                });
                
            });

        });

});



// *****************************************
//      Agregar producto en stock
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res, next) => {

    var body = req.body;
    
    stock = new Stock({
        producto: body.producto,
        cantidad: body.cantidad,
        precio_compra: body.precio_compra
    });

    stock.save((err, stock) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al guardar producto en stock',
               errors: err
           });
        }
        if( !stock ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Producto ya existe en stock',
                errors: {
                    message: 'Ya existe el producto con stock almacenado en el inventario'
                }
            });
        }
        res.status(201).json({
            ok: true,
            stock: stock
        });
        
    });

});



// *****************************************
//      Modificar producto en stock
// *****************************************
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Stock.findById(id, (err, stockDB) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar producto en stock',
               errors: err
           });
        }
        if( !stockDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe producto en el inventario',
                errors: {
                    message: 'No existe producto con ese id en stock'
                }
            });
        }

        stockDB.producto = body.producto;
        stockDB.cantidad = body.cantidad;
        stockDB.precio_compra = body.precio_compra;
        stockDB.updated_at = new Date();

        stockDB.save((err, stockUpdated) => {

            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al actualizar producto',
                   errors: err
               });
            }
            if( !stockUpdated ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: {
                        message: 'Se han introducido campos incorrectos'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                stock: stockUpdated
            });
            

        });

    });

});




module.exports = app;

