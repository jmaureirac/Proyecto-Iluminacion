// *****************************************
//      Valida Admin
// *****************************************
exports.verificaAdmin = function(req, res, next) {
    
    var user = req.user;

    if( user.role === 'ADMIN_ROLE' ) {
        next();
        return;
    } else {
        res.status(403).json({
            ok: false,
            mensaje: 'Error al realizar petición',
            errors: {
                message: 'No tiene permisos para realizar esta acción'
            }
        });
        
    }
    
};


// *****************************************
//      Valida ser Mismo usuario
// *****************************************
exports.verificaMismoUser = function(req, res, next) {

    var id = req.params.id;
    var user = req.user;

    if ( id === user._id ) {
        next();
        return;
    } else {
        res.status(403).json({
            ok: false,
            mensaje: 'Error al realizar la petición',
            errors: {
                message: 'No tiene permisos para realizar esta acción'
            }
        });
        
    }

};


// *****************************************
//      Admin || MismoUser
// *****************************************
exports.verificaAdminMismoUser = function(req, res, next) {

    var id = req.params.id;
    var user = req.user;
    
    if( id === user._id || user.role === 'ADMIN_ROLE' ) {
        next();
        return;
    } else {
        res.status(403).json({
            ok: false,
            mensaje: 'Error al realizar la petición',
            errors: {
                message: 'No puede realizar esta petición'
            }
        });
    }

};
