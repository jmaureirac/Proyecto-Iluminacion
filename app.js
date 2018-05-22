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
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var categoriaRoutes = require('./routes/categoria');
var marcaRoutes = require('./routes/marca');



// TODO: 
// var productoRoutes = require('./routes/producto');
// var stockRoutes = require('./routes/stock');
// var cotizacionRoutes = require('./routes/cotizacion');
// var subcategoriaRoutes = require('./routes/subcategoria');
// var busquedaRoutes = require('./routes/busqueda');



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
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/marca', marcaRoutes);
app.use('/', appRoutes);

// TODO:
// app.use('/producto', productoRoutes);
// app.use('/stock', stockRoutes);
// app.use('/cotizacion', cotizacionRoutes);
// app.use('/subcategoria', subcategoriaRoutes);
// app.use('/busqueda', busquedaRoutes);



// *****************************************
//      Server Listener
// *****************************************
app.listen(3000, () => {
    console.log('Express:', 'on'.green);
});
