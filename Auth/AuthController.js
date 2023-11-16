const User = require("../Models/User");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


function generateAccessToken(id) {

  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "registration error" });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "User already exist" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ ...req.body, password: hashPassword });

      await user.save();
      const token = generateAccessToken(user._id.toString());
      return res.json({ token });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
    
      if (!user) {
        return res.status(400).json({ message: "user does not exist" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "wrong password" });
      }
     
      const token = generateAccessToken(user._id.toString());
      console.log(token)
      return res.status(200).json({ token });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new AuthController();
