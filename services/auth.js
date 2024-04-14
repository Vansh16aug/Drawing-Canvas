const JWT = require("jsonwebtoken");

const secret = process.env.MYSECRETKEY;

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  // console.log(user._id);
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
