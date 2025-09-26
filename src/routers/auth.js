const express = require("express");
const { validateSignupData } = require("../utils/validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/admin");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const newUser = await user.save();
    const token = await user.getJwt();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).send("error saving the user : " + "  " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        const token = await user.getJwt();
        res.cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).send(user);
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (error) {
    res.status(400).send("ERROR : " + " " + error.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token");
  res.send("Logged Out!!!!");
});

module.exports = authRouter;
