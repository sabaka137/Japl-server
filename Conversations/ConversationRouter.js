const Router = require('express');

const router = new Router();
const controller = require('./ConversationController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post('/newConversation', authMiddleware, controller.newConversation);
router.get('/getConversations', authMiddleware, controller.getConversations);
router.get('/getFriend', authMiddleware, controller.getConversationFriend);
router.get('/getMessages', authMiddleware, controller.getMessages);
module.exports = router;
