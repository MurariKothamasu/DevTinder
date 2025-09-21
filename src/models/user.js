const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
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
      minLength: 5,
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
    skils: {
      type: [String],
      validate: {
        validator(value) {
          if (value.length > 10) {
            throw new Error("You can only add up to 10 skills.");
          }
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Chandrasai@192003", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(password, passwordHash);
  return isValidPassword;
};



const User = mongoose.model("User", userSchema);

module.exports = { User };
