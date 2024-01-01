const User = require('../Models/User');
const Conversations = require('../Models/Conversations');
const Message = require('../Models/Messages');

class ConversationController {
  async newConversation(req, res) {
    const conversation = await Conversations.find({ members: { $in: [req.body.senderId] } });
    let ConversationWithReceiverExist = false;
    let SenderAndReceiveConversationId;
    conversation.forEach((el) => {
      if (el.members.includes(req.body.receiverId)) {
        ConversationWithReceiverExist = true;
        SenderAndReceiveConversationId = el._id;
      }
    });

    if (ConversationWithReceiverExist) {
      const data = {
        conversationId: SenderAndReceiveConversationId,
        sender: req.body.senderId,
        text: req.body.text,
        time: req.body.time,
      };
      const newMessage = new Message(data);
      try {
        const savedMessage = await newMessage.save();
        return res.json(savedMessage);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }

    if (!ConversationWithReceiverExist) {
      const newConversation = new Conversations({
        members: [req.body.senderId, req.body.receiverId],
      });
      try {
        const savedConversation = await newConversation.save();
        const data = {
          conversationId: savedConversation._id,
          sender: req.body.senderId,
          text: req.body.text,
          time: req.body.time,
        };
        const newMessage = new Message(data);
        const savedMessage = await newMessage.save();
        return res.json(savedMessage);
      } catch (e) {
        res.status(400).json({ error: e });
      }
    }
  }

  async getConversationFriend(req, res) {
    try {
      const friend = await User.findById(req.query.friendId);
      const conversation = await Conversations.find({ members: { $in: [req.user.id] } });
      let cId;
      conversation.forEach((c) => {
        if (c.members.includes(req.query.friendId)) {
          cId = c._id;
        }
      });
      const messages = await Message.find({ conversationId: cId });
      return res.json({
        friend,
        lastMessage: {
          text: messages[messages.length - 1].text,
          time: messages[messages.length - 1].time,
        },
      });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async getConversations(req, res) {
    try {
      const conversation = await Conversations.find({ members: { $in: [req.query.userId] } });
      return res.json(conversation);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await Message.find({ conversationId: req.query.conversationId });
      return res.json(messages);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new ConversationController();
