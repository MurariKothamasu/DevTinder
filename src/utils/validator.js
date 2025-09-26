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

const validateEditProfileData = (req)=>{
  const ALLOWED_UPDATES = [
      "age",
      "gender",
      "photoUrl",
      "firstName",
      "lastName",
      "about",
      "skills"
    ];
    const isEditAllowed = Object.keys(req.body).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    return isEditAllowed
}



module.exports = {
  validateSignupData , validateEditProfileData
};
