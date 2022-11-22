'use strict'

const tape = require('tape')
const {fetchWithTestApi} = require('./util')
const {allStations} = require('../lib/vbb-stations')

tape.test('/stops works', async (t) => {
	const someStationId = Object.keys(allStations)[0]

	{
		const {headers, data} = await fetchWithTestApi({}, '/stops', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json; charset=utf-8')
		t.equal(typeof data, 'object')
		t.ok(data)
		t.ok(data[someStationId])
		t.equal(Object.keys(data).length, Object.keys(allStations).length)
	}
})

tape.test('/stops?query=hauptbah works', async (t) => {
	const BERLIN_HBF = '900000003201'

	{
		const {headers, data} = await fetchWithTestApi({}, '/stops?query=hauptbah', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json; charset=utf-8')
		t.equal(typeof data, 'object')
		t.ok(data)
		t.ok(data.find(({id}) => id === BERLIN_HBF))
	}
})
