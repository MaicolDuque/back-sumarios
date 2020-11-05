'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const VolumeSchema = new Schema({
  url: { type: String, required: true },
  description: String,
  list_articles: [{ type: Schema.Types.ObjectId, ref: "Article" }]
}, { timestamps: true });

module.exports = mongoose.model('Volume', VolumeSchema);