require("dotenv").config()
const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const request = require("./routers/request");
const { userRouter } = require("./routers/user");

const app = express();



app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/"  , authRouter)
app.use("/" , profileRouter)
app.use("/" , request)
app.use("/" , userRouter)




connectDB().then(() => {
  console.log("Connected to database");
  app.listen(process.env.PORT, () => {
    console.log(process.env.ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY);
    console.log("Server Running on port 3000");
  });
});
