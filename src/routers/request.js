const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/admin");
const { ConnectionRequest } = require("../models/connectionRequest");
const {User} = require("../models/user")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;


      const ALLOWED_STATUS = ["ignored", "intrested"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({message: `Invalid Status type: ${status}`});
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId},
        ],
      });

      if(existingConnectionRequest){
        return res.status(400).json({message: "Connection Request Already exists"});
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({message: "User not found"});
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      if(status === "ignored"){
        res.status(400).send("Ignoredd")
      }

    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  }
);

module.exports = requestRouter;
