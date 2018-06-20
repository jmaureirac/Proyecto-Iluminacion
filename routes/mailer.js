var express = require('express');

var app = express();
var mensaje = require('../config/mensaje');


app.get('/:name/:email', (req, res) => {

    var options = {
        nombre: req.params.name,
        email: req.params.email,
        asunto: `Nueva cotización de ${req.params.email}`,
        mensaje: 'Se ha registrado una nueva cotización en el sistema, favor revisar',
        res
    };

    mensaje( options );

});

module.exports = app;
