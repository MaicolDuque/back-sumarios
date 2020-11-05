'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  mg_name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  mg_status: Boolean,
  mg_role: { type: String, default: 'editor' },
  mg_password: { type: String },
  mg_urlMagazine: { type: String, required: true },
  mg_contact_lists: [{ type: Schema.Types.ObjectId, ref: "ContactList" }],
  mg_list_volumes: [{ type: Schema.Types.ObjectId, ref: "Volume" }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);