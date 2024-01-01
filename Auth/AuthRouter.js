const Router = require('express');

const router = new Router();
const { check } = require('express-validator');
const controller = require('./AuthController');
const authMiddleware = require('../Middleware/AuthMiddleware');

router.post(
  '/registration',
  [
    check('password', 'Пароль должен быть больше 4 и меньше 16 символов').isLength({
      min: 4,
      max: 16,
    }),
  ],
  controller.registration,
);

// router.post("/updateUser",authMiddleware,controller.updateUser);
router.post('/login', controller.login);
module.exports = router;
