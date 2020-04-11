require("dotenv").config();

const jwt = require("jsonwebtoken");

const validateToken = (token) => {
  try {
    const { tokenType } = jwt.verify(token, process.env.SECRET_KEY);
    if (tokenType === "access_token") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const validateHeaders = (ctx, next) => {
  const authorization = ctx.headers["authorization"];
  if (!authorization || !validateToken(authorization)) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      trace: "Not authorized to access resource server.",
    });
  }
  next();
};

module.exports = {
  validateHeaders,
};
