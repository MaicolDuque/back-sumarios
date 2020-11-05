'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  urlHtml: { type: String, required: true },
  title:{ type: String },
  description:{ type: String },
  authors:{ type: String },
  list_keywords: []
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);