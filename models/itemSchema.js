const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: {
    type: String,
    required: [true, 'item name is required...']
  },

  price: {
    type: String,
    required: [true, 'price is required...']
  },

  date: {
    type: Date,
    default: Date.now
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
});

module.exports = mongoose.model('Items', itemSchema);