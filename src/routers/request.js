const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/admin");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

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
        return res
          .status(400)
          .json({ message: `Invalid Status type: ${status}` });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already exists" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const emailres = await sendEmail.run({
        toAddress: toUser.email, // recipient’s email
        fromAddress: "murari@codeconnects.in", // must be verified in SES
        subject: `New ${status} request from ${req.user.firstName}`,
        htmlBody: `
          <h2>Hello ${toUser.firstName},</h2>
          <p>You have received a new <b>${status}</b> request from <b>${req.user.firstName}</b>.</p>
          <p>Please log in to review the request.</p>
        `,
        textBody: `Hello ${toUser.firstName},\n\nYou received a new ${status} request from ${req.user.firstName}.\nLog in to review it.`,
      });

      if (status === "ignored") {
        res.status(200).send("Ignoredd");
      } else {
        res.status(200).send("Connection request send Successfull");
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const status = req.params.status;
    const loggedInUser = req.user;
    const requestId = req.params.requestId;

    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: `Status is Invalid ${status}` });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "intrested",
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: `Connection request ${status} successfully`, data });
  }
);

module.exports = requestRouter;
