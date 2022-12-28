# Getting Started with `v5.bvg.transport.rest`

Let's walk through the **requests that are necessary to implement a typical basic transit app**.

*Note:* To properly & securely handle user input containing URL-unsafe characters, always [URL-encode](https://en.wikipedia.org/wiki/Percent-encoding) your query parameters!

The following code snippets use [`curl`](https://curl.haxx.se) (a versatile command line HTTP tool) and [`jq`](https://stedolan.github.io/jq/) (the command line swiss army knife for processing JSON).

### 1. search for stops

The `/locations?query=…` route allows you to query stops, points of interest (POIs) & addresses. We're only interested in stops though, so we filter using `poi=false&addresses=false`:

```shell
curl 'https://v5.bvg.transport.rest/locations?poi=false&addresses=false&query=mehringdamm' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "900017101",
		"name": "U Mehringdamm",
		"location": {
			"type": "location",
			"id": "900017101",
			"latitude": 52.49357,
			"longitude": 13.388138
		},
		"products": {
			"suburban": false,
			"subway": true,
			"tram": false,
			"bus": true,
			// …
		},
	},
	{
		"type": "stop",
		"id": "900017100",
		"name": "Obentrautstr./U Mehringdamm",
		"location": {
			"type": "location",
			"id": "900017100",
			"latitude": 52.495359,
			"longitude": 13.389621
		},
		"products": { /* … */ },
	},
	// …
]
```

### 2. fetch departures at a stop

Let's fetch 5 of the next departures at *U Mehringdamm* (which has the ID `900017101`):

```shell
curl 'https://v5.bvg.transport.rest/stops/900017101/departures?results=5' -s | jq
```

```js
// todo
[
	{
		"tripId": "1|34562|7|86|29042020",
		"direction": "U Alt-Tegel",
		"line": {
			"type": "line",
			"id": "u6",
			"name": "U6",
			"mode": "train",
			"product": "subway",
			// …
		},

		"when": "2020-04-29T19:39:00+02:00",
		"plannedWhen": "2020-04-29T19:38:00+02:00",
		"delay": 60,
		"platform": null,
		"plannedPlatform": null,

		"stop": {
			"type": "stop",
			"id": "900017101",
			"name": "U Mehringdamm",
			"location": { /* … */ },
			"products": { /* … */ },
		},

		"remarks": [
			{
				"id": "85225",
				"type": "warning",
				"summary": "Keep distance, cover mouth and nose (mandatory from Monday)!",
				"text": "Please cover your mouth and nose when travelling on buses and trains.",
				// …
			},
			// …
		],
	},
	{
		"tripId": "1|34671|11|86|29042020",
		"direction": "S+U Rathaus Spandau",
		"line": {
			"type": "line",
			"id": "u7",
			"name": "U7",
			"mode": "train",
			"product": "subway",
			// …
		},

		"when": "2020-04-29T19:40:00+02:00",
		"plannedWhen": "2020-04-29T19:40:00+02:00",
		"delay": 0,
		"platform": null,
		"plannedPlatform": null,

		"stop": { /* … */ },
		"remarks": [ /* … */ ],
	},
	// …
]
```

Note that `when` includes the `delay`, and `plannedWhen` does not.

### 3. fetch journeys from A to B

We call a connection from A to B – at a specific date & time, made up of sections on specific *trips* – `journey`.

Let's fetch 2 journeys from `900017101` (*U Mehringdamm*) to `900014101` (*U Görlitzer Bahnhof*), departing tomorrow at 2pm (at the time of writing this).

```shell
curl 'https://v5.bvg.transport.rest/journeys?from=900017101&to=900014101&departure=tomorrow+2pm&results=2' -s | jq
```

```js
{
	"journeys": [{
		"type": "journey",
		"legs": [{
			// 1st leg
			"tripId": "1|34614|11|86|30042020",
			"direction": "U Rudow",
			"line": {
				"type": "line",
				"id": "u7",
				"fahrtNr": "19019",
				"name": "U7",
				"mode": "train",
				"product": "subway",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "900017101",
				"name": "U Mehringdamm",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-04-30T14:01:00+02:00",
			"plannedDeparture": "2020-04-30T14:00:00+02:00",
			"departureDelay": 60,
			"departurePlatform": null,
			"plannedDeparturePlatform": null,

			"destination": {
				"type": "stop",
				"id": "900078101",
				"name": "U Hermannplatz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-04-30T14:05:00+02:00",
			"plannedArrival": "2020-04-30T14:05:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": 'A',
			"plannedArrivalPlatform": 'A',

			"cycle": {"min": 300, "max": 300, "nr": 25},
			// …
		}, {
			// 2nd leg
			"tripId": "1|34815|45|86|30042020",
			"direction": "S+U Wittenau",
			"line": {
				"type": "line",
				"id": "u8",
				"name": "U8",
				"mode": "train",
				"product": "subway",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "900078101",
				"name": "U Hermannplatz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-04-30T14:07:00+02:00",
			"plannedDeparture": "2020-04-30T14:07:00+02:00",
			"departureDelay": null,
			"departurePlatform": null,
			"plannedDeparturePlatform": null,

			"destination": {
				"type": "stop",
				"id": "900013102",
				"name": "U Kottbusser Tor",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-04-30T14:13:00+02:00",
			"plannedArrival": "2020-04-30T14:11:00+02:00",
			"arrivalDelay": 120,
			"arrivalPlatform": null,
			"plannedArrivalPlatform": null,

			"cycle": {"min": 600, "max": 600, "nr": 13},
			// …
		}, /* … */ ],
		// …
	}, {
		// 2nd journey
		"type": "journey",
		"legs": [ /* … */ ],
		// …
	}]
}
```

Note that `departure` includes the `departureDelay`, and `arrival` includes the `arrivalDelay`. `plannedDeparture` and `plannedArrival` do not.

### 4. more features

These are the basics. Check the full [API docs](api.md) for all features or use the [OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv5.bvg.transport.rest%2F.well-known%2Fservice-desc%0A) to explore the API!
