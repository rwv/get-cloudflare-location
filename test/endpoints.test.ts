import { endpoints } from "../src/endpoints";
import { describe, test, expect } from "vitest";

describe("endpoints", () => {
  test("should fetch endpoints successfully", async () => {
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint);
      expect(response.ok).toBe(true);
    }
  });
});
