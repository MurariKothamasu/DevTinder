const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5
    },
    gender: {
      type: String,
      validate: {
        validator(value) {
          if (!["male", "female", "others"].includes(value)) {
            throw new Error("Gender data is not Valid");
          }
        },
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default: "",
      validate: {
        validator(value) {
          if (!validator.isURL(value)) {
            throw new Error("Url is not Valid");
          }
        },
      },
    },
    about: {
      type: String,
      default: "This is the default description about the user",
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
