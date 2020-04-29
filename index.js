'use strict'

const {readFileSync} = require('fs')
const {join} = require('path')
const stops = require('./routes/stops')
const createBvgHafas = require('bvg-hafas')
const createHealthCheck = require('hafas-client-health-check')
const createApi = require('hafas-rest-api')
const pkg = require('./package.json')

const berlinFriedrichstr = '900000100001'

const docsAsMarkdown = readFileSync(join(__dirname, 'docs', 'index.md'), {encoding: 'utf8'})

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
	docsLink: '/docs',
	logging: true,
	aboutPage: true,
	docsAsMarkdown,
	etags: 'strong',
	healthCheck: createHealthCheck(hafas, berlinFriedrichstr),
	modifyRoutes,
}

const api = createApi(hafas, config, () => {})

api.listen(config.port, (err) => {
	const {logger} = api.locals
	if (err) {
		logger.error(err)
		process.exit(1)
	} else logger.info(`Listening on ${config.hostname}:${config.port}.`)
})
