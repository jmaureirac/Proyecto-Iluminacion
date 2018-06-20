var nodemailer = require('nodemailer');

var mail_jmc = require('./credenciales').MAIL;
var pass_jmc = require('./credenciales').PASS;


module.exports = ( formulario ) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mail_jmc,
            pass: pass_jmc
        }
    });

    const mailOptions = {
        from: `"${formulario.nombre}" <${formulario.email}>`,
        to: 'jorge.maucamp@gmail.com',
        subject: formulario.asunto,
        html: `
        <strong>Nombre:</strong> ${formulario.nombre} <br/>
        <strong>E-mail:</strong> ${formulario.email}  <br/>
        <strong>Mensaje:</strong> ${formulario.mensaje}
        `
    };


    transporter.sendMail( mailOptions, function(error, info){
        if ( error ) {
            console.log(error);
            return formulario.res.status(500).send({
                ok: false,
                mensaje: 'Ha ocurrido un error al enviar el mensaje',
                errors: error
            });
        } else {
            console.log('Email enviado: ' + info.response);
            return formulario.res.status(200).send({
                ok: true,
                mensaje: 'Mensaje enviado correctamente',
                info: info.response
              });
        }

    });
}