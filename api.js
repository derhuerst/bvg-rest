'use strict'

const {join: pathJoin} = require('path')
const stops = require('./routes/stops')
const createBvgHafas = require('bvg-hafas')
const createHealthCheck = require('hafas-client-health-check')
const {createClient: createRedis} = require('redis')
const withCache = require('cached-hafas-client')
const redisStore = require('cached-hafas-client/stores/redis')
const createApi = require('hafas-rest-api')
const serveStatic = require('serve-static')
const pkg = require('./package.json')

const docsRoot = pathJoin(__dirname, 'docs')

const berlinFriedrichstr = '900000100001'

const modifyRoutes = (routes, hafas, config) => ({
	...routes,
	'/stops': stops(hafas, config),
})

let hafas = createBvgHafas('bvg-rest')
let healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

if (process.env.REDIS_URL) {
	const redis = createRedis({
		url: process.env.REDIS_URL,
	})
	redis.on('error', (err) => {
		api.locals.logger.error(err)
	})
	hafas = withCache(hafas, redisStore(redis))

	const checkHafas = healthCheck
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
		redis.ping((err, res) => {
			if (err) reject(err)
			else resolve(res === 'PONG')
		})
	})
	healthCheck = async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	)
}

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/5/docs/readme.md',
	logging: true,
	aboutPage: false,
	etags: 'strong',
	csp: `default-src 'none' style-src 'self' 'unsafe-inline' img-src https:`,
	healthCheck,
	modifyRoutes,
}

const api = createApi(hafas, config, (api) => {
	api.use('/', serveStatic(docsRoot, {
		extensions: ['html', 'htm'],
	}))
})

module.exports = {
	config,
	api,
}
