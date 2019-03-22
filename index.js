'use strict'

const createBvgHafas = require('bvg-hafas')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')

const pkg = require('./package.json')

const pHafas = (() => {
	const hafas = createBvgHafas('bvg-rest')
	if (!process.env.HAFAS_CLIENT_NODES) return Promise.resolve(hafas)

	const createRoundRobin = require('@derhuerst/round-robin-scheduler')
	const createRpcClient = require('hafas-client-rpc/client')

	const nodes = process.env.HAFAS_CLIENT_NODES.split(',')
	console.info('Using these hafas-client-rpc nodes:', nodes)

	return new Promise((resolve, reject) => {
		createRpcClient(createRoundRobin, nodes, (err, rpcHafas) => {
			if (err) return reject(err)
			rpcHafas.profile = hafas.profile
			resolve(rpcHafas)
		})
	})
})()

const config = {
	hostname: process.env.HOSTNAME || '1.bvg.transport.rest',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/bvg-rest/blob/master/docs/index.md',
	logging: true,
	aboutPage: true
}
const berlinFriedrichstr = '900000100001'

pHafas
.then((hafas) => {
	const cfg = Object.assign(Object.create(null), config)
	cfg.healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

	const api = createApi(hafas, cfg, () => {})
	api.listen(config.port, (err) => {
		if (err) {
			api.locals.logger.error(err)
			process.exitCode = 1
		} else api.locals.logger.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})
