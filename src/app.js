const express = require("express");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const {
  validateSignupData,
  validateUpdateUserData,
} = require("./utils/validator");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName , lastName , email , password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save({validateBeforeSave : false});
    res.send("User Created Succefully");
  } catch (error) {
    res.status(500).send("error saving the user : " + "  " + error.message);
  }
});

app.post("/login" , async(req , res)=>{
  try{
    const {email , password} = req.body
    const user = await User.findOne({email : email})
    if(!user){
      throw new Error("Invalid Credentials")
    }else{
      const isValidPassword = await bcrypt.compare(password , user.password)
      if(isValidPassword){
        res.status(200).send("LoginSuccessfull!!!")
      }else{
        throw new Error("Invalid Credentials")
      }
    }
  }catch(error){
    res.status(400).send("ERROR : " + " " + error.message)
  }
})

app.get("/feed", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.find({ email: email });
    if (user.length === 0) {
      res.status(500).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("something went wrong" + " " + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const data = req.body;
    validateUpdateUserData(req);
    const userID = req.params?.userId;
    const updatedUser = await User.findByIdAndUpdate(userID, data, {
      runValidators: true,
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    } else {
      res.send("Updates Succesfully");
    }
  } catch (error) {
    res.status(404).send("something went wrong" + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.find({ email: email });
    const deletedUser = await User.findByIdAndDelete(user[0]._id);
    if (deletedUser) {
      res.send("deleted User" + deletedUser);
    } else {
      res.send("User not fount with that id");
    }
  } catch (error) {
    res.status(500).send("Something went Wrong");
  }
});

connectDB().then(() => {
  console.log("Connected to database");
  app.listen(3000, () => {
    console.log("Server Running on port 3000");
  });
});
