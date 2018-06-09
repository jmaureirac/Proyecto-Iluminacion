var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');


// *****************************************
//      Obtener imagen 
// *****************************************
app.get('/:img', (req, res) => {

    var img = req.params.img;

    var pathImage = path.resolve( __dirname, `../images/${img}` );

    if( fs.existsSync(pathImage) ) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg' );
        res.sendFile(pathNoImage);
    }

});

module.exports = app;
