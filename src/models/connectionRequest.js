const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);


connectionRequestSchema.index({fromUserId : 1 , toUserId : 1})

connectionRequestSchema.pre("save" , function(next){
  const connectionRequest = this
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot Send Connection Request To YourSelf")
  }
  next()
})

const ConnectionRequest = new mongoose.model("connectionRequest" , connectionRequestSchema)

module.exports = { ConnectionRequest }