const { Schema, model, default: mongoose } = require("mongoose");

const Conversation = new mongoose.Schema({
    members: {type:Array}
});




module.exports = model('Conversation',Conversation)