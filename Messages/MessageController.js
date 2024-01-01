const Message = require('../Models/Messages');

class MessageController {
  async newMessage(req, res) {
    const newMessage = new Message(req.body);
    try {
      const savedMessage = await newMessage.save();
      return res.json(savedMessage);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await Message.find({ conversationId: req.query.conversationId });
      return res.json(messages);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
}

module.exports = new MessageController();
