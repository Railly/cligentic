import assert from "node:assert/strict";
import test from "node:test";
import { fromHttp } from "./error-map.ts";

const errors = {
  AUTH_EXPIRED: {
    name: "AuthExpired",
    human: "Session expired.",
  },
  INVALID_TOKEN: {
    name: "InvalidToken",
    human: "Token is invalid.",
  },
};

test("maps a nested error code envelope", () => {
  const mapped = fromHttp(400, JSON.stringify({ error: { code: "AUTH_EXPIRED" } }), {}, errors);

  assert.equal(mapped.code, "AUTH_EXPIRED");
  assert.equal(mapped.name, "AuthExpired");
});

test("maps a nested error type envelope", () => {
  const mapped = fromHttp(400, JSON.stringify({ error: { type: "INVALID_TOKEN" } }), {}, errors);

  assert.equal(mapped.code, "INVALID_TOKEN");
  assert.equal(mapped.name, "InvalidToken");
});
