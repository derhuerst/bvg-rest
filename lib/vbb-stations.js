import getAllStations from 'vbb-stations'

const allStations = getAllStations()

const allStationsById = Object.create(null)
for (const s of allStations) allStationsById[s.id] = s

export {
	allStations,
	allStationsById,
}
