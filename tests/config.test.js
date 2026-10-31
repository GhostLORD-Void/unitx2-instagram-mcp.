import test from "node:test";
import assert from "node:assert/strict";

test("requires a versioned Graph API configuration", () => {
  assert.match("v23.0", /^v\d+\.\d+$/);
  assert.doesNotMatch("latest", /^v\d+\.\d+$/);
});
