'use strict'

const createHafas = require('hafas-client')
const bvgProfile = require('hafas-client/p/bvg')
const createApi = require('hafas-rest-api')

const pkg = require('./package.json')

const config = {
	hostname: process.env.HOSTNAME || '1.bvg.transport.rest',
	port: process.env.PORT || 3000,
	name: pkg.name,
	description: pkg.description,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/master/docs/index.md',
	logging: true,
	aboutPage: true
}

const hafas = createHafas(bvgProfile, 'bvg-rest')
const api = createApi(hafas, config, () => {})

api.listen(config.port, (err) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	} else {
		console.info(`Listening on ${config.hostname}:${config.port}.`)
	}
})
