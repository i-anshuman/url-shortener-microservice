const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  short: {
    type: Number,
    require: true,
    unique: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
});
module.exports = mongoose.model('URLSchema', urlSchema);
