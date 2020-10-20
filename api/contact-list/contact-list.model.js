'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactListSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  mg_contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }]
}, { timestamps: true });

module.exports = mongoose.model('ContactList', ContactListSchema);