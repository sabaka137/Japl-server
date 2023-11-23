const User = require("../Models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");


const initialCollection = {
  name: "First Collection",
  description: "have a nice day",
  termins: [
    { id: 1, termin: "犬", meaning: "dog", reading: "いぬ" },
    { id: 2, termin: "猫", meaning: "cat", reading: "ねこ" },
    { id: 3, termin: "家", meaning: "house", reading: "いえ" },
    { id: 4, termin: "人", meaning: "person", reading: "ひと" },
    { id: 5, termin: "日本", meaning: "Japan", reading: "にほん" },
    { id: 6, termin: "学校", meaning: "school", reading: "がっこう" },
    { id: 7, termin: "食べる", meaning: "eath", reading: "たべる" },
    { id: 8, termin: "見る", meaning: "look", reading: "みる" },
    { id: 9, termin: "行く", meaning: "walk", reading: "いく" },
    { id: 10, termin: "来る", meaning: "to come", reading: "くる" },
  ],
  id: new mongoose.Types.ObjectId()
};

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
      const user = new User({ ...req.body, password: hashPassword,groups:initialCollection});

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
      console.log(token);
      return res.status(200).json({ token });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new AuthController();
