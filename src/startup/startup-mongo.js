'use strict';

console.log('Starting Mongo');
const mongoose = require('mongoose');
const config = require('../../config/config');

console.log('Reading Config');
const { protocol, host, name, opts } = config.db;
const uri = `${protocol}://${host}/${name}${opts ? `?${opts}` : ''}`;

console.log(`Mongo uri: ${uri}`);

module.exports = () => {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		autoIndex: true,
	})
		.then(() => console.log('Connected to database'))
		.catch(e => console.log(e));
};
