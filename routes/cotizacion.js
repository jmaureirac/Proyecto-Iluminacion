var express = require('express');
var mongoose = require('mongoose');

var mdAuth = require('../middlewares/auth');
var mdUser = require('../middlewares/user');

var app = express();

var Cotizacion = require('../models/cotizacion');



// *****************************************
//      Obtener todas las cotizaciones
// *****************************************
app.get('/', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cotizacion.find({})
        .sort('-created_at')
        .skip(desde)
        .limit(10)
        .populate('user', 'name email')
        .populate('productos')
        .populate('productos.producto', 'nombre subcategoria precio_unitario img')
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


// *****************************************
//      Obtener una cotización por ID
// *****************************************
app.get('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Cotizacion.findById(id)
        .populate('user', 'name email')
        .populate('productos')
        .populate('productos.producto', 'nombre subcategoria precio_unitario img')
        .exec((err, cotizacion) => {
            if( err ) {
                return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cotización',
                errors: err
            });
            }
            if( !cotizacion ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede encontrar cotización',
                    errors: {
                        message: 'No existe cotizacion con ese id'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                cotizacion 
            });
            
    });

});


// *****************************************
//      Obtener las cotizaciones de un user
// *****************************************
app.get('/user/:id', [mdAuth.verificaToken, mdUser.verificaAdminMismoUser], (req, res) => {

    var id_user = req.params.id;

    Cotizacion.find({ user: id_user })
        .sort('-created_at')
        .populate('user', 'name email')
        .populate('productos')
        .populate('productos.producto', 'nombre subcategoria precio_unitario img')
        .exec((err, cotizaciones) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al cargar las cotizaciones',
                   errors: err
               });
            }
            if( !cotizaciones ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encuentran cotizaciones para ese usuario',
                    errors: {
                        message: 'El usuario buscado no tiene cotizaciones'
                    }
                });                
            }
            res.status(200).json({
                ok: true,
                cotizaciones
            });
                       
        });

});


// *****************************************
//      Agregar una cotizacion
// *****************************************
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;
    var productos = body.productos;
    
    var cotizacion = new Cotizacion({
        user: body.user,
        productos: productos,
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

        return res.status(200).json({
            ok: true,
            cotizacion
        });

    });

});



module.exports = app;

