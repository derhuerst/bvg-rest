// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

import {dirname, join as pathJoin} from 'path'
import {fileURLToPath} from 'node:url'
import {
	createBvgHafas,
	defaults as bvgHafasDefaults,
} from 'bvg-hafas'
import {createWriteStream} from 'node:fs'
import createHealthCheck from 'hafas-client-health-check'
import Redis from 'ioredis'
import {createCachedHafasClient as withCache} from 'cached-hafas-client'
import {createRedisStore as redisStore} from 'cached-hafas-client/stores/redis.js'
import {createHafasRestApi as createApi} from 'hafas-rest-api'
import serveStatic from 'serve-static'
const pkg = require('./package.json')

import {createRoute as stops} from './routes/stops.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = pathJoin(__dirname, 'docs')

const berlinFriedrichstr = '900100001'

const customBvgProfile = {
	...bvgHafasDefaults.profile,
}

// todo: DRY env var check with localaddress-agent/random-from-env.js
// Currently, this is impossible: localaddress-agent is an optional dependencies, so we rely on it to check the env var.
if (process.env.RANDOM_LOCAL_ADDRESSES_RANGE) {
	const {randomLocalAddressAgent} = await import('localaddress-agent/random-from-env.js')

	customBvgProfile.transformReq = (_, req) => {
		req.agent = randomLocalAddressAgent
		return req
	}
}

if (process.env.HAFAS_REQ_RES_LOG_FILE) {
	const hafasLogPath = process.env.HAFAS_REQ_RES_LOG_FILE
	const hafasLog = createWriteStream(hafasLogPath, {flags: 'a'}) // append-only
	hafasLog.on('error', (err) => console.error('hafasLog error', err))

	customBvgProfile.logRequest = (ctx, req, reqId) => {
		console.error(reqId, 'req', req.body + '') // todo: remove
		hafasLog.write(JSON.stringify([reqId, 'req', req.body + '']) + '\n')
	}
	customBvgProfile.logResponse = (ctx, res, body, reqId) => {
		console.error(reqId, 'res', body + '') // todo: remove
		hafasLog.write(JSON.stringify([reqId, 'res', body + '']) + '\n')
	}
}

const modifyRoutes = (routes, hafas, config) => ({
	...routes,
	'/stops': stops(hafas, config),
})

let hafas = createBvgHafas(pkg.name, {
	profile: customBvgProfile,
})
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
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/6/docs/readme.md',
	openapiSpec: true,
	logging: true,
	aboutPage: false,
	etags: 'strong',
	csp: `default-src 'none' style-src 'self' 'unsafe-inline' img-src https:`,
	healthCheck,
	modifyRoutes,
}

const api = await createApi(hafas, config, (api) => {
	api.use('/', serveStatic(docsRoot, {
		extensions: ['html', 'htm'],
	}))
})

export {
	hafas,
	config,
	api,
}
