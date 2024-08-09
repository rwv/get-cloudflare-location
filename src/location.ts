import { endpoints } from "./endpoints";

let cachedLocationPromise: Promise<string> | undefined;

export interface GetCloudflareLocationOptions {
  timeout?: number;
  cache?: boolean;
}

/**
 * Get the location of the user based on the Cloudflare network.
 * @param options Options for the request.
 * @param options.timeout The timeout for the request in milliseconds. Defaults to 5000.
 * @param options.cache Whether to cache the result of the request. Defaults to true.
 * @returns The location of the user.
 * @throws {DOMException} If the location could not be found.
 * @throws {AggregateError} If all requests timed out.
 * @example
 * ```js
 * import getCloudflareLocation from "get-cloudflare-location";
 *
 * const location = await getCloudflareLocation();
 * console.log(location);
 * ```
 */
export async function getCloudflareLocation(
  options?: GetCloudflareLocationOptions,
): Promise<string> {
  const cache: boolean = options?.cache === undefined ? true : options.cache;

  if (cache && cachedLocationPromise != null) {
    return await cachedLocationPromise;
  }

  const controller = new AbortController();
  // add timeout
  setTimeout(() => {
    controller.abort();
  }, options?.timeout ?? 5000);

  const locationPromises = endpoints.map(
    async (endpoint) =>
      await getCloudflareLocationFromEndpoint(endpoint, controller.signal),
  );

  const locationPromise = Promise.any(locationPromises);

  if (cache) {
    cachedLocationPromise = locationPromise;
  }

  const location = await locationPromise;

  controller.abort();

  return location;
}

async function getCloudflareLocationFromEndpoint(
  endpoint: string,
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch(endpoint, { signal });
  const text = await response.text();
  const loc = text.split("\n").find((line) => line.startsWith("loc="));

  /* v8 ignore next 3 */
  if (loc === undefined) {
    throw new DOMException("Location not found");
  }

  return loc.split("=")[1];
}
