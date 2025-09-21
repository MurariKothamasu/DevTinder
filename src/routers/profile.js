const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/admin");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("ERROR : " + " " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateEditProfileData(req);
    const user = req.user;
    if (!isEditAllowed) {
      throw new Error("Invalid User Details");
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,  runValidators: true 
    });
    res.json({
      message: `${user.firstName} : Your profile updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const isCurrentPasswordValid = await user.validatePassword(currentPassword);

    if(currentPassword === newPassword){
      return res.json({message : "new Password is same as Current Password"})
    }
    if (!isCurrentPasswordValid) {
     return res.status(400).json({ message: "current Password in Invalid" });
    }
    if(!validator.isStrongPassword(newPassword)){
      return res.status(400).json({message : "New password must be Strong"})
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: passwordHash } , {runValidators : true});
    res.json({ message: "password Updated Successfully" });
  } catch (error) {

  }
});
module.exports = profileRouter;
