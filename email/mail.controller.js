const nodemailer = require('nodemailer'); // email sender function 
const { email } = require('../config');

exports.sendEmail = function (req, res) {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: email.emailSend,
            pass: email.passSend,
        },
    });
    console.log(req.body)
    // Definimos el email
    const mailOptions = {
        from: 'notificacionespcjic@gmail.com',
        to: 'mcamilin.cr@gmail.com',
        subject: 'Solicitud de registro',
        html: `<h4>Información del solicitante</h4><p>${req.body}</p>`
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