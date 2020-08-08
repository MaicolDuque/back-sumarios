'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  role: { type: String, default: 'editor' },
  password: { type: String },
  provider: String,
  urlMagazine: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 