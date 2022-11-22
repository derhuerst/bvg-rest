'use strict'

const getAllStations = require('vbb-stations')

const allStations = getAllStations()

const allStationsById = Object.create(null)
for (const s of allStations) allStationsById[s.id] = s

module.exports = {
	allStations,
	allStationsById,
}
