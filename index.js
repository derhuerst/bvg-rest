import {api, config} from './api.js'

api.listen(config.port, (err) => {
	const {logger} = api.locals
	if (err) {
		logger.error(err)
		process.exit(1)
	}
	logger.info(`listening on ${config.port} (${config.hostname}).`)
})
