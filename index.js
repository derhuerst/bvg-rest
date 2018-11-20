'use strict'

const bvgProfile = require('hafas-client/p/bvg')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')

const pkg = require('./package.json')

const pHafas = (() => {
	if (!process.env.HAFAS_CLIENT_NODES) {
		const createHafas = require('hafas-client')
		const hafas = createHafas(bvgProfile, 'bvg-rest')
		return Promise.resolve(hafas)
	}

	const createRoundRobin = require('@derhuerst/round-robin-scheduler')
	const createRpcClient = require('hafas-client-rpc/client')

	const nodes = process.env.HAFAS_CLIENT_NODES.split(',')
	console.info('Using these hafas-client-rpc nodes:', nodes)

	return new Promise((resolve, reject) => {
		createRpcClient(createRoundRobin, nodes, (err, rpcHafas) => {
			if (err) return reject(err)
			rpcHafas.profile = bvgProfile
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

const onError = (err) => {
	console.error(err)
	process.exitCode = 1
}

pHafas
.then((hafas) => {
	const cfg = Object.assign(Object.create(null), config)
	cfg.healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

	const api = createApi(hafas, cfg, () => {})
	api.listen(config.port, (err) => {
		if (err) onError(err)
		else console.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
.catch(onError)
