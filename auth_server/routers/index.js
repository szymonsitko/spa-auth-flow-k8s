require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = [];

router.post("/sign_up", (req, res) => {
  users.push(req.body);
  return res
    .status(200)
    .json({ success: true, createdResource: { user: req.body.username } });
});

router.post("/sign_in", (req, res) => {
  const { body } = req;

  const userExists = users.filter(
    ({ username, email, password }) =>
      username === body.username &&
      email === body.email &&
      password === body.password
  );
  if (!userExists.length) {
    return res.status(401).json({
      success: false,
      trace: "Not authorized.",
    });
  }

  try {
    const refreshToken = jwt.sign(
      {
        tokenType: "refresh_token",
        exp: Math.floor(Date.now() / 1000) + 60 * 15,
      },
      process.env.SECRET_KEY
    );
    const accessToken = jwt.sign(
      {
        tokenType: "access_token",
        exp: Math.floor(Date.now() / 1000) + 60 * 2,
      },
      process.env.SECRET_KEY
    );
    res.json({
      success: true,
      tokens: {
        refresh_token: refreshToken,
        access_token: accessToken,
        type: "Bearer",
      },
    });
  } catch ({ message }) {
    res.status(400).json({
      success: false,
      trace: message,
    });
  }
});

module.exports = {
  authRouter: router,
};
