const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: {
    type: String,
    required: [true, 'name is required...']
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'email is required...']
  },

  password: {
    type: String,
    required: [true, 'password is required...']
  },

  date: {
    type: Date,
    default: Date.now
  },

  createdItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items'
    }
  ]
});

module.exports = mongoose.model('Users', userSchema);