# ☁️ get-cloudflare-location

> [!CAUTION]  
> `https://cf-ns.com/cdn-cgi/trace` returns `404 Not Found` now. **Don't** use this package!

A JavaScript function to get user's location based on Cloudflare `/cdn-cgi/trace`

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/rwv/get-cloudflare-location/build.yml)](https://github.com/rwv/get-cloudflare-location/actions/workflows/build.yml)
[![npm](https://img.shields.io/npm/v/get-cloudflare-location)](https://www.npmjs.com/package/get-cloudflare-location)
![NPM](https://img.shields.io/npm/l/get-cloudflare-location)

## How it works

This function will send a request to `https://www.cloudflare.com/cdn-cgi/trace` and `https://cf-ns.com/cdn-cgi/trace` and parse the response to get the user's location.

## Usage

```bash
npm install get-cloudflare-location
```

```ts
import getCloudflareLocation from "get-cloudflare-location";

interface GetCloudflareLocationOptions {
  timeout?: number; // The timeout for the request in milliseconds. Defaults to 5000
  cache?: string; // Whether to cache the result of the request. Defaults to true.
}

const options: GetCloudflareLocationOptions | undefined = {
  timeout: 5000,
  cache: true,
};

const location = await getCloudflareLocation(options);
```

## cf-ns.com

`cf-ns.com` is the domain of the Cloudflare China Network, allowing users in mainland China to get location in low latency.

## License

MIT
