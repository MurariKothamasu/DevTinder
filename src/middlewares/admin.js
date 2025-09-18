const adminAuth = function (req, res, next) {
  const token = "xyz";
  const isValidToken = token === "xyz";
  if (!isValidToken) {
    res.status(404).send("Unauthorized User");
  } else {
    next();
  }
};

const userAuth = function (req, res, next) {
  const token = "xyz";
  const isValidToken = token === "xyz";
  if (!isValidToken) {
    res.status(404).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = {adminAuth , userAuth}
