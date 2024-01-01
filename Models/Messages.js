const { Schema, model, default: mongoose } = require('mongoose');

const Message = new mongoose.Schema({
  conversationId: { type: String },
  sender: { type: String },
  text: { type: String },
  time: { type: String },
});

module.exports = model('Messages', Message);
