'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SummarySchema = new Schema({
  name: { type: String, required: true },
  description:{ type: String },
  favorite:{ type: Boolean },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  list_articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  list_keywords: [],
  contact_list_id: { type: Schema.Types.ObjectId, ref: "ContactList" },
}, { timestamps: true });

module.exports = mongoose.model('Summary', SummarySchema);