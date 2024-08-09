import getCloudflareLocation from "../src";
import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should get the location successfully", async () => {
    const location = await getCloudflareLocation();
    expect(location).toBeDefined();
  });
});
