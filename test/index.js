import tape from 'tape'
import {fetchWithTestApi} from './util.js'
import {allStations} from '../lib/vbb-stations.js'

tape.test('/stops works', async (t) => {
	const someStationId = allStations[0].id
	console.error({someStationId})

	{
		const {headers, data} = await fetchWithTestApi({}, '/stops', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json; charset=utf-8')
		t.ok(Array.isArray(data))
		t.ok(data.find(({id}) => id === someStationId))
		t.equal(data.length, Object.keys(allStations).length)
	}
})

tape.test('/stops?query=berlin%20ha works', async (t) => {
	const BERLIN_HBF = 'de:11000:900003201'

	{
		const {headers, data} = await fetchWithTestApi({}, '/stops?query=berlin%20ha', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json; charset=utf-8')
		t.ok(Array.isArray(data))
		t.ok(data.find(({id}) => id === BERLIN_HBF))
	}
})
