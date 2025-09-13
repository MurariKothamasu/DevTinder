const express = require("express")

const app = express();

app.use( "/test" ,(req , res , next)=>{
  res.send("hello From Serverr")
})



app.listen(3000 , ()=>{
  console.log("Server Running on port 3000")
})
