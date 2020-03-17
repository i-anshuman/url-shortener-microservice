const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlCounter = new Schema({
  count: {
    type: Number,
    default: 0
  }
});
module.exports = mongoose.model('URLCounter', urlCounter);
