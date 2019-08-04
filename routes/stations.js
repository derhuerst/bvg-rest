'use strict'

const getAllStations = require('vbb-stations')
const parse = require('cli-native').to
const autocomplete = require('vbb-stations-autocomplete')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const allStations = getAllStations()
const allStationsById = Object.create(null)
for (const s of allStations) allStationsById[s.id] = s

const enrichResult = (res) => {
	const station = allStationsById[res.id]
	return station ? Object.assign({}, station, res) : res
}

const usingHafas = (hafas, req, res, next) => {
	const q = req.query
	const limit = q.results ? parseInt(q.results) : 5
	const fuzzy = parse(q.fuzzy) === true

	hafas.locations(q.query + (fuzzy ? '?' : ''), {
		poi: false, addresses: false, results: limit
	})
	.then((results) => {
		res.json(results.map(enrichResult))
		next()
	})
	.catch(next)
}

const usingAutocomplete = (req, res, next) => {
	const q = req.query
	const limit = q.results ? parseInt(q.results) : 5
	const fuzzy = parse(q.fuzzy) === true
	const completion = parse(q.completion) !== false
	const results = autocomplete(q.query, limit, fuzzy, completion)

	// todo: caching
	res.json(results.map(enrichResult))
	next('route')
}

const createStationsRoute = (hafas) => {
	const stations = (req, res, next) => {
		if (req.query.query) {
			if (parse(req.query['use-hafas']) === true) {
				usingHafas(hafas, req, res, next)
			} else usingAutocomplete(req, res, next)
		} else {
			// todo: caching
			res.json(allStations)
			next()
		}
	}
	return stations
}

module.exports = createStationsRoute
