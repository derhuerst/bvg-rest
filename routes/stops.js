'use strict'

const getAllStations = require('vbb-stations')
const parse = require('cli-native').to
const autocomplete = require('vbb-stations-autocomplete')

const allStations = getAllStations()
const allStationsById = Object.create(null)
for (const s of allStations) allStationsById[s.id] = s

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
	return stops
}

module.exports = createStopsRoute
