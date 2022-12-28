# `v5.bvg.transport.rest` documentation

[`v5.bvg.transport.rest`](https://v5.bvg.transport.rest/) is a [REST API](https://restfulapi.net) for the [Berlin](https://en.wikipedia.org/wiki/Berlin) public transportation system, [BVG](https://en.wikipedia.org/wiki/Berliner_Verkehrsbetriebe).

[![API status](https://badgen.net/uptime-robot/status/m784879513-ed3cc45a865db0ba57af0001)](https://stats.uptimerobot.com/57wNLs39M/784879513)

Because it wraps [a BVG API](https://github.com/public-transport/hafas-client/blob/6/readme.md#background) of BVG, it **includes all local traffic of Berlin & Brandenburg, as well as some long-distance trains running in the area**. Essentially, it returns whatever data the [BVG app](https://www.bvg.de/en/tickets-tariffs/all-apps/fahrinfo-app) shows, **including realtime delays and disruptions**.

- [Getting Started](getting-started.md)
- [API documentation](api.md)
- [OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv5.bvg.transport.rest%2F.well-known%2Fservice-desc%0A)

## Why use this API?

### Realtime Data

This API returns realtime data whenever its upstream, the [API for BVG's mobile app](https://github.com/public-transport/hafas-client/blob/33d7d30acf235c54887c6459a15fe581982c6a19/p/bvg/readme.md), provides it.

### No API Key

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 requests/minute (burst 150 requests/minute) set up.

### CORS

This API has [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) enabled, so you can query it from any webpage.

### Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients cache responses properly.
