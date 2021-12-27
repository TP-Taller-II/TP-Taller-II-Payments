'use strict';

const winston = require('winston');

const options = {
	level: 'info',
	handle_exceptions: true,
	colorize: true,
	silent: false,
	timestamp: true,
	pretty_print: true,
	label: '',
	levels: {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	},
	colors: {
		debug: 'white',
		info: 'grey',
		notice: 'green',
		warn: 'yellow',
		error: 'red',
		crit: 'blue',
		alert: 'magenta',
		emerg: 'cyan',
	},
};

// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
	transports: [
		new winston.transports.Console(options),
	],
	exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
	write(message) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	},
};

module.exports = logger;
