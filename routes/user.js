var express = require('express');
var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth');
var mdUser = require('../middlewares/user');

var app = express();

var User = require('../models/user');


// *****************************************
//      Obtener usuarios paginados
// *****************************************
app.get('/', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var desde = req.query.desde || 0; // Parametro opcional desde
    desde = Number(desde);

    User.find({}, 'name email role google created_at updated_at')
        .skip(desde)
        .limit(10)
        .exec((err, usuarios) => {

            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al cargar usuarios',
                   errors: err
               });
            }
            
            User.count({}, (err, cantidad) => {

                if( err ) {
                    return res.status(400).json({
                       ok: false,
                       mensaje: 'Error al contar usuarios',
                       errors: err
                   });
                }
                
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: cantidad
                });
                
            });

        });

});


// *****************************************
//      Obtener todos los usuarios
// *****************************************
app.get('/all', [mdAuth.verificaToken, mdUser.verificaAdmin] , (req, res) => {


    User.find({}, 'name email role google created_at updated_at')
        .exec((err, usuarios) => {

            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al cargar usuarios',
                   errors: err
               });
            }
            
            User.count({}, (err, cantidad) => {

                if( err ) {
                    return res.status(400).json({
                       ok: false,
                       mensaje: 'Error al contar usuarios',
                       errors: err
                   });
                }
                
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: cantidad
                });
                
            });

        });

});


// *****************************************
//      Agregar usuario
// *****************************************
app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userSaved) => {

        if( err ) {
            return res.status(400).json({
               ok: false,
               mensaje: 'Error al crear usuario',
               errors: err
           });
        }
        
        res.status(201).json({
            ok: true,
            user: userSaved
        });
        
    });

});


// *****************************************
//      Modificar usuario
// *****************************************
app.put('/:id', [mdAuth.verificaToken, mdUser.verificaAdminMismoUser], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar usuario',
               errors: err
           });
        }
        
        if( !user ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario inexistente',
                errors: {
                    message: 'No existe usuario con ese id'
                }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        user.updated_at = new Date();

        user.save((err, userSaved) => {

            if( err ) {
                return res.status(400).json({
                   ok: false,
                   mensaje: 'Error al actualizar',
                   errors: err
               });
            }
            
            user.password = '?';

            res.status(200).json({
                ok: true,
                user: userSaved
            });        

        });

    });

});


// *****************************************
//      Eliminar un usuario
// *****************************************
app.delete('/:id', [mdAuth.verificaToken, mdUser.verificaAdmin], (req, res) => {

    var id = req.params.id;
    
    User.findByIdAndRemove(id, (err, userDeleted) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al eliminar usuario',
               errors: err
           });
        }
        
        if( !userDeleted ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario inexistente',
                errors: {
                    message : 'No existe un usuario con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    });

});



// *****************************************
//      Cambiar contraseña de usuario
// *****************************************
app.put('/cambiar-password/:id', [mdAuth.verificaToken, mdUser.verificaMismoUser], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    if( !body.password || !body.newpassword || !body.newpassword2 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Los campos de contraseñas son obligatorios',
            errors: {
                message: 'Los campos de contraseñas son obligatorios'
            }
        });
        
    }

    if( body.newpassword !== body.newpassword2 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Las contraseñas no coinciden2',
            errors: {
                message: 'Las contraseñas no coinciden2'
            }
        });
        
    }
    

    User.findById(id, (err, userDB) => {

        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar usuario',
               errors: err
           });
        }
        if( !userDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario inexistente',
                errors: err
            });
        }


        if( !bcrypt.compareSync( body.password, userDB.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las contraseñas no coinciden',
                errors: {
                    message: 'Las contraseñas no coinciden'
                }
            });
        }

        userDB.password = bcrypt.hashSync(body.newpassword, 10);
        userDB.updated_at = new Date();
        
        userDB.save((err, userUpdated) => {

            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al actualizar contraseña',
                   errors: err
               });
            }
            
            userDB.password = "?";

            res.status(200).json({
                ok: true,
                user: userUpdated
            });
            
        });

    });

});



module.exports = app;

