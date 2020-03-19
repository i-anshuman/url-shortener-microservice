const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlCounter = new Schema({
  count: {
    type: Number,
    default: 1
  }
});
module.exports = mongoose.model('URLCounter', urlCounter);
