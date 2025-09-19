const express = require("express");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const {validateSignupData} = require("./utils/validator");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/admin")
const app = express();


app.use(express.json());
app.use(cookieParser());


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
        const token = jwt.sign({_id : user._id} , "Chandrasai@192003" ,{expiresIn : "7d"})
        res.cookie("token" , token , {expires : new Date(Date.now() + 8 * 3600000)})
        res.status(200).send("LoginSuccessfull!!!")
      }else{
        throw new Error("Invalid Credentials")
      }
    }
  }catch(error){
    res.status(400).send("ERROR : " + " " + error.message)
  }
})

app.get("/profile" , userAuth,  async(req , res)=>{
  try {
    const user = req.user
    res.send(user)
  } catch (error) {
      res.status(500).send("ERROR : " +  " " + error.message )
  }

})



connectDB().then(() => {
  console.log("Connected to database");
  app.listen(3000, () => {
    console.log("Server Running on port 3000");
  });
});
