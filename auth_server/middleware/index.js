const validatePayload = (source) => {
  if (!source.username || !source.email || !source.password) {
    return false;
  }
  return true;
};

const validateBody = (req, res, next) => {
  const { body } = req;
  if (!validatePayload(body)) {
    return res
      .status(400)
      .json({ success: false, trace: "Unable to process request." });
  }
  next();
};

module.exports = {
  validateBody,
};
