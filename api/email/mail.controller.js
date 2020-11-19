const nodemailer = require('nodemailer'); // email sender function 
const { emailTransfer } = require('../../config');
const ContactList = require("../contact-list/contact-list.model");
const Summary = require("../summary/summary.model");
const htmlSummaries = require('./info-email-summary');
const SendingHistory = require('./sending-history.model');


function configTransporter() {
	return nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: emailTransfer.emailSend,
			pass: emailTransfer.passSend,
		},
	});
}

function sendEmail(req, res) {
	const { mg_name, email, mg_urlMagazine } = req.body
	const transporter = configTransporter() // Definimos el transporter - config SMTP
	console.log(mg_name, email, mg_urlMagazine)
	// Definimos el email
	const mailOptions = {
		from: 'notificacionespcjic@gmail.com',
		to: 'maicolduque01@gmail.com',
		subject: 'Sumario',
		// html: `<html><body><h2>Información del solicitante</h2><p><b>Nombre del solicitante:</b> ${mg_name}<br><b>Correo del solicitante:</b> ${email}<br><b>URL del solicitante:</b> ${mg_urlMagazine}</p> <p><b>Recuerda que puedes activarlo dando click aquí o desde la aplicación web</p></body></html>`
		html: htmlSummaries()
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


async function sendEmailSummary(req, res) {
	try {
		const { listaId, summaryId, name, name_magazine, userId } = req.body
		const contacts = await ContactList.findOne({ _id: listaId }, { mg_contacts: 1 }).populate({ path: 'mg_contacts', model: 'Contact' }).exec()
		const articles = await Summary.findOne({ _id: summaryId }, { list_articles: 1 }).populate({ path: 'list_articles', model: 'Article' }).exec()
		const emailContacts = contacts.mg_contacts.map(contact => contact.c_email).toString()
		const mailOptions = {
			from: 'notificacionespcjic@gmail.com',
			to: emailContacts,
			subject: name,
			html: htmlSummaries(articles.list_articles, name_magazine)
		};
		await createSendingHistory(summaryId, userId, listaId)
		return emailSend(mailOptions)
			.then(info => res.send(info))
			.catch(error => { res.status(500).send(error); console.log(error) })
	} catch (error) {
		console.log(error)
		return res.status(500).send(error)
	}
}

function createSendingHistory(summary, user, contact_list) {
	const send = new SendingHistory({ summary, user, contact_list })
	return send.save()
}

function retrieveEmailSentsByUser(req, res) {
	const { _id } = req.params
	return SendingHistory.find({ user: _id })
		.populate({ select: { name: 1, description: 1 }, path: 'summary', model: 'Summary' })
		.populate({ select: { name: 1, description: 1 }, path: 'contact_list', model: 'ContactList' }).exec()
		.then(info => res.send(info))
		.catch(error => { res.status(500).send(error); console.log(error) })
}

async function emailSend(config) {
	const transporter = configTransporter() // Definimos el transporter - config SMTP
	transporter.sendMail(config, function (error, info) { // Enviamos el email
		if (error) {
			console.log(error);
			return error
		} else {
			console.log("Email sent");
			res.status(200).json(req.body);
		}
	});
}

module.exports = {
	sendEmail,
	sendEmailSummary,
	retrieveEmailSentsByUser
}