const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const request = require("./routers/request");
const { userRouter } = require("./routers/user");
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/"  , authRouter)
app.use("/" , profileRouter)
app.use("/" , request)
app.use("/" , userRouter)




connectDB().then(() => {
  console.log("Connected to database");
  app.listen(3000, () => {
    console.log("Server Running on port 3000");
  });
});
