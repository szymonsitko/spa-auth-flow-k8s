const supertest = require("supertest");

const { createServer } = require("../server");

describe("sign_up endpoint", () => {
  let app;

  beforeAll(() => {
    app = createServer();
  });

  afterAll(() => {
    app.close();
  });

  describe("when body payload is valid", () => {
    it("should return valid response", async () => {
      const userBody = {
        username: "simon",
        email: "simon@email.com",
        password: "somepass",
      };
      const { body, status } = await supertest(app)
        .post("/sign_up")
        .set("Content-Type", "application/json")
        .send(userBody);

      expect(status).toEqual(200);
      const { success, createdResource } = body;
      expect(success).toBeTruthy();
      expect(createdResource.user).toEqual(userBody.username);
    });
  });

  describe("when body payload is invalid", () => {
    it("should return fail response", async () => {
      const { body, status } = await supertest(app).post("/sign_up").send({
        invalid: "body",
      });

      expect(status).toEqual(400);

      const { success, trace } = body;
      expect(success).toBeFalsy();
      expect(trace).toEqual("Unable to process request.");
    });
  });
});
