var express = require('express');
var mongoose = require('mongoose');

var mdAuth = require('../middlewares/auth');


var app = express();

var Cotizacion = require('../models/cotizacion');



// *****************************************
//      Obtener todas las cotizaciones
// *****************************************
app.get('/', mdAuth.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cotizacion.find({})
        .sort('-created_at')
        .skip(desde)
        .limit(10)
        .populate('user', 'name email')
        .populate('productos')
        .populate('productos.producto', 'nombre precio_unitario img')
        .exec((err, cotizaciones) => {
            
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al cargar cotizaciones',
                   errors: err
               });
            }
            if( !cotizaciones ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existen cotizaciones',
                    errors: {
                        message: 'No hay cotizaciones registradas'
                    }
                });
            }

            Cotizacion.count({}, (err, cantidad) => {

                if( err ) {
                    return res.status(500).json({
                       ok: false,
                       mensaje: 'Error al contar cotizaciones',
                       errors: err
                   });
                }
                
                res.status(200).json({
                    ok: true,
                    cotizaciones: cotizaciones,
                    total: cantidad
                });
                
            });
            
        });

});


// FIXME: stringify productos y despues parse pa guardar
// *****************************************
//      Agregar una cotizacion
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;
    var productos = body.productos;
    
    var todos = productos.split(';');
    
    var arrayProductos = [];

    for (let i = 0; i < todos.length; i++) {
        let json = {};
        let unproducto = todos[i].split('.');
        json.producto = mongoose.Types.ObjectId(unproducto[0]);
        json.cantidad = Number(unproducto[1]);
        arrayProductos.push(json);
    }
    
    // 5b038e93a8a95b790ae8c282.13;5b038b1d58c2c6769abb9fd0.3;5b038b9f72fa8276daf27e14.5;5b038e2469fd0c7885f78c86.7
    // Formato de body.productos
    // id_producto.cantidad;id_producto.cantidad;id_producto.cantidad para poder pasar a array

    
    var cotizacion = new Cotizacion({
        user: body.user,
        productos: arrayProductos,
        created_at: body.created_at
    });
    
    
    cotizacion.save((err, cotizacionSaved) => {
        
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar la cotización',
                errors: err
            });
        }
        if( !cotizacionSaved ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Datos incorrectos',
                errors: {
                    message: 'Se ingresaron datos incorrectos'
                }
            });
        }

        res.status(200).json({
            ok: true,
            user: body.user,
            productos: arrayProductos
        });

    });

});



module.exports = app;

