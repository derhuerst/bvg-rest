import _cliNative from 'cli-native'
const {to: parse} = _cliNative
import autocomplete from 'vbb-stations-autocomplete'
import {allStations, allStationsById} from '../lib/vbb-stations.js'

// todo: DRY with db-rest/routes/stations.js & vbb-rest/routes/stations.js?

const enrichResult = (res) => {
	const station = allStationsById[res.id]
	return station ? Object.assign({}, station, res) : res
}

// todo: combine this with the /locations?query route?
const createStopsRoute = (hafas) => {
	const stops = (req, res, next) => {
		const q = req.query
		if (!('query' in q)) {
			// todo: proper caching
			res.json(allStations)
			return next()
		}

		const nrOfResults = q.results ? parseInt(q.results) : 5
		const fuzzy = parse(q.fuzzy) === true
		const completion = parse(q.completion) !== false

		const results = autocomplete(q.query, nrOfResults, fuzzy, completion)
		res.json(results.map(enrichResult))
	}

	stops.openapiPaths = {
		'/stops': {
			get: {
				summary: 'Autocompletes stops/stations by name or filters stops/stations.',
				description: `\
Uses [\`vbb-stations-autocomplete@4\`](https://github.com/derhuerst/vbb-stations-autocomplete/tree/4.5.0) to find stops/stations matching \`query\`. If you don't pass \`query\`, it will just return all stops from [\`vbb-stations@8\`](https://github.com/derhuerst/vbb-stations/tree/8.3.1).`,
				parameters: [{
					name: 'query',
					in: 'query',
					description: 'Filter by name, e.g. `mehringd` with `completion=true`, or `mehringdamm` with `completion=false`.',
					schema: {
						type: 'string',
					},
				}, {
					name: 'limit',
					in: 'query',
					description: '*If `query` is used:* Return at most `n` stations.',
					schema: {
						type: 'integer',
						default: 5,
					},
				}, {
					name: 'fuzzy',
					in: 'query',
					description: 'Find other than *exact* matches?',
					schema: {
						type: 'boolean',
						default: false,
					},
				}, {
					name: 'completion',
					in: 'query',
					description: 'Search by prefix?',
					schema: {
						type: 'boolean',
						default: true,
					},
				}],
				responses: {
					'2XX': {
						description: 'An array of stops/stations, in the [`vbb-stations@7` format](https://github.com/derhuerst/vbb-stations/blob/8.3.1/readme.md).',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {type: 'object'}, // todo
								},
								// todo: example(s)
							},
						},
					},
				},
			},
		},
	}

	stops.queryParameters = {
		query: {
			description: 'Filter by name, e.g. `mehringd` with `completion=true`, or `mehringdamm` with `completion=false`.',
			type: 'string',
			defaultStr: '–',
		},
		results: {
			description: 'How many stops/stations?',
			type: 'number',
			default: 5,
		},
		fuzzy: {
			description: 'Find other than *exact* matches?',
			type: 'boolean',
			default: false,
		},
		completion: {
			description: 'Search by prefix?',
			type: 'boolean',
			default: true,
		},
	}
	return stops
}

export {
	createStopsRoute as createRoute,
}
