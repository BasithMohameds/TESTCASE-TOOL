const jwt = require("jsonwebtoken");

//create access token
exports.accessTokenGenerator = (email) => {
  const token = jwt.sign({ email }, process.env.jwt_key, {
    expiresIn: "1h",
  });
  return token;
};

exports.refreshTokenGenerator = (email) => {
  const token = jwt.sign({ email }, process.env.jwt_key, {
    expiresIn: "1d",
  });
  return token;
};
