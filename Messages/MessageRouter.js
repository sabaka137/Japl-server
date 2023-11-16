const Router = require("express");
const router = new Router();
const controller = require("./MessageController");
const authMiddleware = require('../Middleware/AuthMiddleware')

router.post("/newMessage",authMiddleware,controller.newMessage);
router.get("/getMessages",authMiddleware,controller.getMessages);
module.exports = router;
