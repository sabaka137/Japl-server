const Router = require("express");
const router = new Router();
const controller = require("./UsersContoller");
const authMiddleware = require('../Middleware/AuthMiddleware')

router.get("/getTeachers",authMiddleware,controller.getTeachers);
router.get("/getTeacher",authMiddleware,controller.getTeacher);
router.get("/getUsers",authMiddleware,controller.getUsers);
router.get("/getUser",authMiddleware,controller.getUser);
router.get("/getLessons",authMiddleware,controller.getLessons);
router.get("/refreshData",authMiddleware,controller.refreshData);
router.get("/getFavoriteTeachers",authMiddleware,controller.getFavoriteTeachers);
router.get("/subcribeNotifications",authMiddleware,controller.subscribeNotifications);
router.post("/setLessons",authMiddleware,controller.setLessons);
router.post("/updateUser",authMiddleware,controller.updateUser);
router.post("/addToFavorite",authMiddleware,controller.addToFavorite);
router.post("/removeFromFavorite",authMiddleware,controller.removeFromFavorite);
module.exports = router;
