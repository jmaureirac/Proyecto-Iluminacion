var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var app = express();

var User = require('../models/user');

var menu_user = require('../config/menu').USER_MENU;
var menu_admin = require('../config/menu').ADMIN_MENU; 

// Cargar constantes token y Google
const SEED = require('../config/config').SEED;
const CLIENT_ID = require('../config/config').CLIENT_ID;

// Requires necesarios para el Google SignIn
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// *****************************************
//      Autenticación normal
// *****************************************
app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        
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
                    message: 'No existe usuario con ese email'
                }
            });
        }

        if( !bcrypt.compareSync(body.password, user.password) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: {
                    message: 'Contraseña incorrecta'
                }
            });
        }

        // CREAR TOKEN  
        user.password = '?';
        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

        var menu;
        if( user.role === 'ADMIN_ROLE' ) {
            menu = menu_admin;
        } else {
            menu = menu_user;
        }
        
        res.status(200).json({
            ok: true,
            user: user,
            menu: menu,
            token: token,
            id: user._id
        });
        
    });

});



/* jshint ignore:start */ // Ignorar warning/error jshint 

// *****************************************
//      funcion verificar Token Google
// *****************************************
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };

}


// *****************************************
//      Autenticación Google
// *****************************************
app.post('/google', async(req, res) => {
    var token = req.body.token;
    
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'Token inválido'
            });
        });

    
        User.findOne( { email: googleUser.email }, (err, userDB) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al buscar usuario',
                   errors: err
               });
            }
            if( userDB ) {
                if( userDB.google === false ){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No puede autenticarse con google',
                        errors: {
                            message: 'Ya esta registrado anteriormente, pero sin google'
                        }
                    });
                } else {
                    var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

                    var menu;
                    if( userDB.role === 'ADMIN_ROLE' ) {
                        menu = menu_admin;
                    } else {
                        menu = menu_user;
                    }

                    res.status(200).json({
                        ok: true,
                        user: userDB,
                        menu: menu,
                        token: token,
                        id: userDB._id
                    });
                }
            } else {
                // Usuario inexistente, crear

                var user = new User({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: ':)',
                    role: 'USER_ROLE',
                    google: true,
                });

                
                user.save( (err, userSaved) => {
                    if( err ) {
                        return res.status(500).json({
                           ok: false,
                           mensaje: 'Error al guardar usuario',
                           errors: err
                       });
                    }
                    
                    var token = jwt.sign({ usuario: userSaved }, SEED, { expiresIn: 14400 });

                    res.status(200).json({
                        ok: true,
                        user: userSaved,
                        menu: menu_user,
                        token: token,
                        id: userSaved._id
                    });

                });
                
            }

        });

});

/* jshint ignore:end */

module.exports = app;

