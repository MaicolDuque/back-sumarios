const nodemailer = require('nodemailer'); // email sender function 
const { emailTransfer } = require('../../config');

function sendEmail  (req, res) {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailTransfer.emailSend,
            pass: emailTransfer.passSend,
        },
    });
    const {mg_name, email, mg_urlMagazine} = req.body
    console.log(mg_name, email, mg_urlMagazine)
    // Definimos el email
    const mailOptions = {
        from: 'notificacionespcjic@gmail.com',
        to: 'mcamilin.cr@gmail.com',
        subject: 'Solicitud de registro',
        html: `<html><body><h2>Información del solicitante</h2><p><b>Nombre del solicitante:</b> ${mg_name}<br><b>Correo del solicitante:</b> ${email}<br><b>URL del solicitante:</b> ${mg_urlMagazine}</p> <p><b>Recuerda que puedes activarlo dando click aquí o desde la aplicación web</p></body></html>`
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(500, err.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    });
};

module.exports = {
    sendEmail
  }