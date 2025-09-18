const mongoose = require("mongoose");
// mongoose.connect(
//   "mongodb+srv://KothamasuChandrasai:Chandrasai%40192003@practicecluster.izsipds.mongodb.net/"
// ).then(console.log("Connection successfull"))

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://KothamasuChandrasai:Chandrasai%40192003@practicecluster.izsipds.mongodb.net/devTinder"
  );
}

module.exports = { connectDB };