require("dotenv").config()
const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const request = require("./routers/request");
const { userRouter } = require("./routers/user");
const http = require("http")
const {initializeSocket} = require("./utils/socket")
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

const server = http.createServer(app) 

initializeSocket(server)

connectDB().then(() => {
  console.log("Connected to database");
  server.listen(process.env.PORT, () => {
    console.log("Server Running on port 3000");
  });
});
