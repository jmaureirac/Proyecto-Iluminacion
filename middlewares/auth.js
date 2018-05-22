var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// *****************************************
//      Función Verificar Token
// *****************************************
exports.verificaToken = function(req, res, next) {

    var token = req.query.token; // revisa existencia de token en url

    jwt.verify( token, SEED, (err, decoded) => {
        
        if( err ) {
            return res.status(401).json({
               ok: false,
               mensaje: 'Token inválido',
               errors: err
           });
        }

        req.user = decoded.user;
        
        next();

    });

};
