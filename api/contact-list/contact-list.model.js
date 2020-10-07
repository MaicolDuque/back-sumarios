'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactListSchema = new Schema({
  name: { type: String, required: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('ContactList', ContactListSchema);