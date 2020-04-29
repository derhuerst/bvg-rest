'use strict'

const stops = require('./routes/stops')
const createBvgHafas = require('bvg-hafas')
const createHealthCheck = require('hafas-client-health-check')
const createApi = require('hafas-rest-api')
const pkg = require('./package.json')

const berlinFriedrichstr = '900000100001'

const modifyRoutes = (routes, hafas, config) => ({
	...routes,
	'/stops': stops(hafas, config),
})

const hafas = createBvgHafas('bvg-rest')

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/5/docs/readme.md',
	logging: true,
	aboutPage: true,
	etags: 'strong',
	healthCheck: createHealthCheck(hafas, berlinFriedrichstr),
	modifyRoutes,
}

const api = createApi(hafas, config, () => {})

module.exports = {
	config,
	api,
}
