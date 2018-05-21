// *****************************************
//      Requires
// *****************************************
var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var mongoose = require('mongoose');



// *****************************************
//      Express
// *****************************************
var app = express();



// *****************************************
//      Body-Parser
// *****************************************
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// *****************************************
//      Importar Rutas
// *****************************************





// *****************************************
//      CORS
// *****************************************
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});



// *****************************************
//      Conexión a MongoDB
// *****************************************
mongoose.connection.openUri('mongodb://localhost:27017/proyecto-iluminacion', (err, res) => {

    if( err ) throw err;

    console.log('MongoDB:', 'on'.green);

});



// *****************************************
//      RUTAS
// *****************************************




// *****************************************
//      Server Listener
// *****************************************
app.listen(3000, () => {
    console.log('Express:', 'on'.green);
});
