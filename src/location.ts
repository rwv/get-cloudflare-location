import { endpoints } from "./endpoints";

let cachedLocationPromise: Promise<string> | undefined = undefined;

export async function getCloudflareLocation(options?: {
  timeout?: number;
  cache?: boolean;
}): Promise<string> {
  if (options?.cache && cachedLocationPromise) {
    return await cachedLocationPromise;
  }

  const controller = new AbortController();
  // add timeout
  setTimeout(() => controller.abort(), options?.timeout ?? 5000);

  const locationPromises = endpoints.map((endpoint) =>
    getCloudflareLocationFromEndpoint(endpoint, controller.signal)
  );

  const location = Promise.any(locationPromises);

  if (options?.cache) {
    cachedLocationPromise = location;
  }

  return await location;
}

async function getCloudflareLocationFromEndpoint(
  endpoint: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(endpoint, { signal });
  const text = await response.text();
  const loc = text.split("\n").find((line) => line.startsWith("loc="));

  if (loc === undefined) {
    throw new DOMException("Location not found");
  }

  return loc.split("=")[1];
}
