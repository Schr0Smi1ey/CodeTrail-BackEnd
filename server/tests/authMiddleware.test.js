import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAuth } from "../middleware/authMiddleware.js";

const verifyIdToken = vi.fn();

vi.mock("../config/firebaseAdmin.js", () => ({
  getFirebaseAuth: () => ({ verifyIdToken }),
}));

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("requireAuth", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
  });

  it("allows any verified Firebase email", async () => {
    verifyIdToken.mockResolvedValue({
      uid: "user-1",
      email: "learner@example.com",
      email_verified: true,
      name: "Learner",
    });
    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createResponse();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toEqual({
      uid: "user-1",
      email: "learner@example.com",
      name: "Learner",
    });
    expect(res.statusCode).toBe(200);
  });
});
