require("dotenv").config();

const supertest = require("supertest");
const jwt = require("jsonwebtoken");

const { createServer } = require("../server");

describe("authorize access", () => {
  let app = createServer();

  afterAll(() => {
    app.close();
  });

  describe("when request can be authorized", () => {
    it("should return generic app message and ok status code", async () => {
      const { body, status } = await supertest(app.callback())
        .get("/resources")
        .set("Authorization", jwt.sign({ tokenType: "access_token" }, process.env.SECRET_KEY));

      expect(status).toEqual(200);
      const { application } = body;

      expect(application).not.toBeUndefined();
      expect(application).toEqual("ResourceServer v 1.0");
    });
  });

  describe("when request cannot be authorized", () => {
    it("should return not authorized code and error message", async() => {
      const { body, status } = await supertest(app.callback())
        .get("/resources")

      expect(status).toEqual(401);
      expect(body.trace).toEqual("Not authorized to access resource server.");
    });
  });
});
