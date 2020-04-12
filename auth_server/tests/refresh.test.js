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
    it("should return valid response with new access_token", async () => {
      const refreshToken = jwt.sign(
        {
          tokenType: "refresh_token",
          exp: Math.floor(Date.now() / 1000) + 60 * 15,
        },
        process.env.SECRET_KEY
      );
      const { body, status } = await supertest(app)
        .post("/refresh")
        .set("Content-Type", "application/json")
        .send({ refresh_token: refreshToken, type: "Bearer" });

      expect(status).toEqual(200);

      const { access_token, type } = body.tokens;
      const validateNewAccessToken = jwt.verify(
        access_token,
        process.env.SECRET_KEY
      );

      expect(validateNewAccessToken.tokenType).toEqual("access_token");
      expect(type).toEqual("Bearer");
    });
  });

  describe("when body payload is invalid", () => {
    it("should return fail response", async () => {
      const { body, status } = await supertest(app).post("/refresh").send({
        refresh_token: "invalid token", type: "Bearer"
      });

      expect(status).toEqual(400);

      const { success, message } = body;
      expect(success).toBeFalsy();
      expect(message).toEqual("Unable to refresh access token.");
    });
  });
});
