require("dotenv").config();
const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.SECRET_ACCESS_KEY?.trim(),
  },
});

module.exports = { sesClient };