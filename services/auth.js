const JWT = require("jsonwebtoken");

const secret = process.env.MYSECRETKEY;

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImage: user.profileImage,
    role: user.role,
  };
  // console.log(user.profileImage);
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
