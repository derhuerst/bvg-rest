# Why use this API?

The public transport agency [*Berliner Verkehrsbetriebe* (BVG) itself provides an API called *HAFAS*](https://github.com/public-transport/hafas-client/blob/e02a20b1de59bda3cd380445b6105e4c46036636/p/bvg/readme.md), this API wraps it. Why use this one? (And what could BVG do better?)

## No API Key

The underlying HAFAS API has been designed to be *private*: It has only 1 static API key, which is valid for an unlimited time, and which can't easily be revoked/renewed. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled**, the underyling HAFAS API does not.

## Readable Markup

Compare the underlying HAFAS API:

```js
{
	type: 'DEP',
	locL: [
		{
			name: 'Bus 120',
			number: '120',
			line: '120',
			icoX: 1,
			cls: 32,
			oprX: 0,
			prodCtx: {
				name: 'Bus  120',
				num: '0',
				line: '120',
				catOut: 'Bus',
				catOutS: 'Bus',
				catOutL: 'Bus',
				catIn: 'Bus',
				catCode: '5'
			}
		}
	],
	jny: {
		jid: '1|1026145|36|80|18072016',
		date: '20160718',
		prodX: 20,
		dirTxt: 'Moabit, Lüneburger Str.',
		dirFlg: '2',
		status: 'P',
		isRchbl: true,
		stbStop: {
			locX: 0,
			idx: 23,
			dProdX: 20,
			dTimeS: '143900',
			dTimeR: '143930',
			dProgType: 'PROGNOSED'
		},
		approxDelay: false
	}
}
```

to this one:

```js
{
	tripId: '1|1026145|36|80|18072016',
	stop: {
		type: 'stop',
		id: '900000003201',
		name: 'Hauptbahnhof (S+U), Berlin',
		location: {
			type: 'location',
			latitude: 52.525847,
			longitude: 13.368924
		},
		products: { /* … */ }
	},
	when: '2016-07-18T14:39:30.000+01:00',
	delay: 30,
	line: {
		type: 'line',
		id: '120',
		mode: 'bus',
		product: 'bus',
		public: true,
		name: '120',
		// …
	},
	direction: 'Moabit, Lüneburger Str.'
}
```

## Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients to refresh their state efficiently.

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## Proper HTTP, Proper REST

This wrapper API follows [REST-ful design principles](https://restfulapi.net), it uses `GET`, and proper paths & headers.
