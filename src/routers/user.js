const express = require("express");
const { userAuth } = require("../middlewares/admin");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const USER_PUBLIC_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "skils",
  "about",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "intrested",
    }).populate("fromUserId", USER_PUBLIC_DATA);

    res.status(200).send(requests);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
  //user logged in or not
  //send the connection requests where touserId === loggedin user id
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_PUBLIC_DATA);

    const data = connectionRequests.map((val) => {
      if (val.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return val.toUserId;
      }
      return val.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 40 : limit
    const skip = (page-1) * limit

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((val) => {
      hideUsersFromFeed.add(val.fromUserId.toString());
      hideUsersFromFeed.add(val.toUserId.toString());
    });
  
    const users = await User.find({
      $and : [
        {_id : {$nin : Array.from(hideUsersFromFeed)}}, 
        {_id : {$ne : loggedInUser._id}}
      ]
    }).select(USER_PUBLIC_DATA).skip(skip).limit(limit)
    
    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message)
  }
});
module.exports = { userRouter }; 
