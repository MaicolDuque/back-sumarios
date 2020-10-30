'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  url: { type: String, required: true },
  title:{ type: String, required: true },
  description:{ type: String, required: true },
  authors:{ type: String },
  list_keywords: []
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);