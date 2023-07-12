import { endpoints } from './endpoints'

let cachedLocationPromise: Promise<string> | undefined

/**
 * Get the location of the user based on the Cloudflare network.
 * @param options Options for the request.
 * @param options.timeout The timeout for the request in milliseconds. Defaults to 5000.
 * @param options.cache Whether to cache the result of the request. Defaults to false.
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
export async function getCloudflareLocation (options?: {
  timeout?: number
  cache?: boolean
}): Promise<string> {
  if (options?.cache === true && (cachedLocationPromise != null)) {
    return await cachedLocationPromise
  }

  const controller = new AbortController()
  // add timeout
  setTimeout(() => { controller.abort() }, options?.timeout ?? 5000)

  const locationPromises = endpoints.map(async (endpoint) =>
    await getCloudflareLocationFromEndpoint(endpoint, controller.signal)
  )

  const location = Promise.any(locationPromises)

  if (options?.cache === true) {
    cachedLocationPromise = location
  }

  return await location
}

async function getCloudflareLocationFromEndpoint (
  endpoint: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(endpoint, { signal })
  const text = await response.text()
  const loc = text.split('\n').find((line) => line.startsWith('loc='))

  if (loc === undefined) {
    throw new DOMException('Location not found')
  }

  return loc.split('=')[1]
}
