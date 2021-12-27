'use strict';

const mongoose = require('mongoose');
const config = require('../../config/config');
const logger = require('../helpers/logger');

logger.info('Starting Mongo');
logger.info('Reading Config');
const { protocol, host, name, opts } = config.db;
const uri = `${protocol}://${host}/${name}${opts ? `?${opts}` : ''}`;

logger.info(`Mongo uri: ${uri}`);

module.exports = () => {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		autoIndex: true,
	})
		.then(() => logger.info('Connected to database'))
		.catch(e => logger.error(e));
};
