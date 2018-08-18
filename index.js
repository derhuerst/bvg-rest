'use strict'

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

const onError = (err) => {
	console.error(err)
	process.exitCode = 1
}

const startApi = (hafas) => {
	const api = createApi(hafas, config, () => {})

	api.listen(config.port, (err) => {
		if (err) onError(err)
		else console.info(`Listening on ${config.hostname}:${config.port}.`)
	})
}

if (process.env.HAFAS_CLIENT_NODES) {
	const createRoundRobin = require('@derhuerst/round-robin-scheduler')
	const createRpcClient = require('hafas-client-rpc/client')

	const nodes = process.env.HAFAS_CLIENT_NODES.split(',')
	console.info('Using these hafas-client-rpc nodes:', nodes)

	createRpcClient(createRoundRobin, nodes, (err, rpcHafas) => {
		if (err) return onError(err)
		rpcHafas.profile = bvgProfile
		startApi(rpcHafas)
	})
} else {
	const createHafas = require('hafas-client')

	const hafas = createHafas(bvgProfile, 'bvg-rest')
	startApi(hafas)
}
