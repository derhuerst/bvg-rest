// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

import {dirname, join as pathJoin} from 'path'
import {fileURLToPath} from 'node:url'
import createBvgHafas from 'bvg-hafas'
import createHealthCheck from 'hafas-client-health-check'
import Redis from 'ioredis'
import withCache from 'cached-hafas-client'
import redisStore from 'cached-hafas-client/stores/redis.js'
import createApi from 'hafas-rest-api'
import serveStatic from 'serve-static'
const pkg = require('./package.json')

import {createRoute as stops} from './routes/stops.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = pathJoin(__dirname, 'docs')

const berlinFriedrichstr = '900000100001'

const modifyRoutes = (routes, hafas, config) => ({
	...routes,
	'/stops': stops(hafas, config),
})

let hafas = createBvgHafas(pkg.name)
let healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

if (process.env.REDIS_URL) {
	const redis = new Redis(process.env.REDIS_URL || null)
	hafas = withCache(hafas, redisStore(redis))

	const checkHafas = healthCheck
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
		redis.ping().then(
			res => resolve(res === 'PONG'),
			reject,
		)
	})
	healthCheck = async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	)
}

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/5/docs/readme.md',
	openapiSpec: true,
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

export {
	hafas,
	config,
	api,
}
