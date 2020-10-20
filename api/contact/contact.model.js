'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
  c_name: { type: String, required: true },
  c_email:{ type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);