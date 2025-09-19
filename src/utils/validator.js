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



module.exports = {
  validateSignupData
};
