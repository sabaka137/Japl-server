const Router = require("express");
const router = new Router();
const controller = require("./GroupsController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.post("/createGroup", authMiddleware, controller.createGroup);
router.delete("/deleteGroup", authMiddleware, controller.deleteGroup);
router.post("/updateGroup", authMiddleware, controller.updateGroup);
router.post("/addToGroup", authMiddleware, controller.addToGroup);
router.get("/getGroups", authMiddleware, controller.getGroups);
router.get("/getGroup", authMiddleware, controller.getGroup);
router.get("/getGroupNames", authMiddleware, controller.getGroupNames);
module.exports = router;
