'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SendingHistorySchema = new Schema({
  summary: { type: Schema.Types.ObjectId, ref: "Summary" },
  user: { type: Schema.Types.ObjectId, ref: "Summary" },
  contact_list: { type: Schema.Types.ObjectId, ref: "Summary" }
}, { timestamps: true });

module.exports = mongoose.model('SendingHistory', SendingHistorySchema);