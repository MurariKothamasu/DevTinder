const jwt = require("jsonwebtoken");
const {User} = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Thoken Invalid");
    }
    const decodeObject = await jwt.verify(token, "Chandrasai@192003");
    const { _id } = decodeObject;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user
    next();
  } catch (error) {
    res.status(400).send("MESSAGE : " + error.message )
  }
};

module.exports = { userAuth };
