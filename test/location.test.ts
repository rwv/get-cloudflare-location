import { getCloudflareLocation } from "../src/location";
import { describe, test, expect } from "vitest";

describe("location", () => {
  test("should get the location successfully", async () => {
    const location = await getCloudflareLocation();
    expect(location).toBeDefined();
  });

  test("should get the location with a timeout", async () => {
    const location = await getCloudflareLocation({ timeout: 3000 });
    expect(location).toBeDefined();
  });

  test("should get the location without caching", async () => {
    const location = await getCloudflareLocation({ cache: false });
    expect(location).toBeDefined();
  });

  test("should get the location without caching and with a timeout", async () => {
    const location = await getCloudflareLocation({
      cache: false,
      timeout: 3000,
    });
    expect(location).toBeDefined();
  });

  test("should get the location with caching", async () => {
    const location = await getCloudflareLocation({ cache: true });
    expect(location).toBeDefined();
    const cachedLocation = await getCloudflareLocation({ cache: true });
    expect(cachedLocation).toBeDefined();
  });

  test("should fail to get the location with a timeout", async () => {
    expect(
      getCloudflareLocation({ timeout: 1, cache: false }),
    ).rejects.toThrow();
  });
});
