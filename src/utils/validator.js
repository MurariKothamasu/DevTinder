const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid" + "  " + req.body.email);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateUpdateUserData = (req) => {
  const ALLOWED_UPDATES = ["photoUrl", "gender", "age", "about", "password"];
  const isUpdateAllowed = Object.keys(req.body).every((k) => {
    return ALLOWED_UPDATES.includes(k);
  });
  if (!isUpdateAllowed) {
    throw new Error("Updation is not Allowed");
  }
};

module.exports = {
  validateSignupData, validateUpdateUserData
};
