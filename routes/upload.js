var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
const path = require('path');

var app = express();
app.use(fileUpload());

var mdAuth = require('../middlewares/auth');
var mdUser = require('../middlewares/user');


var Producto = require('../models/producto');


// *****************************************
//      Actualizar foto de producto
// *****************************************
app.put('/:id', [mdAuth.verificaToken, mdUser.verificaAdmin],(req, res) => {

    var id = req.params.id;

    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe seleccionar una imagen',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }

    // Obtener extensión del archivo
    var archivo = req.files.imagen;
    var archivoSplit = archivo.name.split('.');
    var extension =  archivoSplit[ archivoSplit.length - 1 ];

    // Extensiones válidas
    var extensionesValidas = ['png', 'jpg', 'jpeg'];

    if( extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión inválida',
            errors: {
                message: `Las extensiones válidas son ${extensionesValidas.join(', ')}`
            }
        });        
    }

    // Nombre de archivo
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Mover el archivo del temporal al path
    var pathnew = `./images/${nombreArchivo}`;

    archivo.mv(pathnew, err => {
        if( err ) {
            return res.status(500).json({
               ok: false,
               mensaje: 'Error al mover el archivo',
               errors: err
           });
        }

        Producto.findById(id, (err, producto) => {
            if( err ) {
                return res.status(500).json({
                   ok: false,
                   mensaje: 'Error al buscar producto',
                   errors: err
               });
            }
            if( !producto ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Producto inexistente',
                    errors: {
                        message: 'No existe producto con ese id'
                    }
                });
            }

            // Borrar imagen si existe
            var oldPath = path.resolve(__dirname, `../images/${producto.img}`);
            if( fs.existsSync(oldPath) ) {
                fs.unlink(oldPath);
            }

            // Guardar imagen
            producto.img =  nombreArchivo;
            producto.save( (err, productoSaved) => {
                if( err ) {
                    return res.status(500).json({
                       ok: false,
                       mensaje: 'Error al actualizar imagen',
                       errors: err
                   });
                }
                if( !productoSaved ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No se pudo actualizar imagen',
                        errors: {
                            message: 'No se puede actualizar imagen'
                        }
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del producto actualizada',
                    producto: productoSaved
                });
                
            });
            // Fin guardar imagen
        });
        
        
    });

});


module.exports = app;
