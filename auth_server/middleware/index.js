const validFields = ["username", "email", "password"];
const validatePayload = (source, toCompare) =>
  Object.keys(source).every((each) => toCompare.includes(each));

const validateBody = (req, res, next) => {
  const { body } = req;
  if (!validatePayload(body, validFields)) {
    return res
      .status(400)
      .json({ success: false, trace: "Unable to sign up new user." });
  }
  next();
};

module.exports = {
  validateBody,
};
