const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/admin");
requestRouter.post("/sendConnectionRequest" , userAuth,async(req ,res)=>{
  const user = req.user
  res.send(user._id + "Sending Connection Request!!!!")
})

module.exports = requestRouter