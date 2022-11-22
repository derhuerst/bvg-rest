'use strict'

const tape = require('tape')
const {fetchWithTestApi} = require('./util')

tape.test('/stops?query=hauptbah works', async (t) => {
	const BERLIN_HBF = '900000003201'

	{
		const {headers, data} = await fetchWithTestApi({}, '/stops?query=hauptbah', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json; charset=utf-8')
		t.ok(Array.isArray(data))
		t.ok(data.find(({id}) => id === BERLIN_HBF))
	}
})
