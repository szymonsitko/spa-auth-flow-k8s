require("dotenv").config();

const supertest = require("supertest");
const jwt = require("jsonwebtoken");

const { createServer } = require("../server");

describe("sign_in endpoint", () => {
  const userData = {
    username: "newUser",
    email: "newUser@email.com",
    password: "somepass",
  };
  let app;

  beforeAll(async () => {
    app = createServer();
    await supertest(app).post("/sign_up").send(userData);
  });

  afterAll(() => {
    app.close();
  });

  describe("when body payload is valid", () => {
    it("should return valid response", async () => {
      const { body, status } = await supertest(app)
        .post("/sign_in")
        .set("Content-Type", "application/json")
        .send(userData);

      expect(status).toEqual(200);
      
      const { refresh_token, access_token, type } = body.tokens;
      const validateRefreshToken = jwt.verify(refresh_token, process.env.SECRET_KEY);
      const validateAccessToken = jwt.verify(access_token, process.env.SECRET_KEY);

      expect(validateRefreshToken.tokenType).toEqual("refresh_token");
      expect(validateAccessToken.tokenType).toEqual("access_token");
      expect(type).toEqual("Bearer");
    });
  });

  describe("when body payload is invalid", () => {
    it("should return fail response", async () => {
      const { body, status } = await supertest(app).post("/sign_in").send({
        username: "non",
        email: "existent",
        password: "user"
      });

      expect(status).toEqual(401);

      const { success, message } = body;
      expect(success).toBeFalsy();
      expect(message).toEqual("Not authorized.");
    });
  });
});
