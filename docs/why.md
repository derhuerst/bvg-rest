# Why use this API?

The public transport agency *Berliner Verkehrsbetriebe* (BVG) itself provides an API (this API wraps around it). Why use this one? (And what could BVG do better?)

## No API Key

Especially on web sites/apps, it isn't feasable to the send API keys to the client. Also, you have to obtain these keys manually and cannot automatically revoke them. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled.**

## Sane Markup

Compare the official API:

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

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## Proper HTTP, Proper REST

All methods in this API comply with the [REST principles](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) and use proper [HTTP methods](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).
