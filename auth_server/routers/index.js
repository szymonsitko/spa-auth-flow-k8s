require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const { validateBody } = require("../middleware");

const router = express.Router();
const users = [];

const NOT_AUTHORIZED_ERROR = "Not authorized.";
const BAD_REQUEST_ERROR = "Unable to refresh access token.";

router.post("/sign_up", validateBody, (req, res) => {
  users.push(req.body);
  return res
    .status(200)
    .json({ success: true, createdResource: { user: req.body.username } });
});

router.post("/sign_in", validateBody, (req, res) => {
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
      message: NOT_AUTHORIZED_ERROR,
      trace: null
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
router.post("/refresh", (req, res) => {
  const { refresh_token, type } = req.body;
  try {
    const { tokenType } = jwt.verify(refresh_token, process.env.SECRET_KEY);
    if (tokenType === "refresh_token" && type === "Bearer") {
      const accessToken = jwt.sign(
        {
          tokenType: "access_token",
          exp: Math.floor(Date.now() / 1000) + 60 * 2,
        },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        succes: true,
        tokens: {
          access_token: accessToken,
          type: "Bearer",
        },
      });
    }
    throw new Error(BAD_REQUEST_ERROR);
  } catch ({ message }) {
    res.status(400).json({
      success: false,
      message: BAD_REQUEST_ERROR,
      trace: message,
    });
  }
});

module.exports = {
  authRouter: router,
};
