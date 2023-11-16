const jwt = require("jsonwebtoken");
const { secret } = require("../config");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    if (!req.headers.authorization) {
      return res.status(404).json({ message: "user is not authorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodeData = jwt.decode(token, secret);
    req.user = decodeData;
    next();
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
