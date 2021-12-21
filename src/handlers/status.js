'use strict';

const STATUS_CODES = require('../utils/status-codes.json');

const starting_date = Date.now();

const getContract = async (req, res) => {
	res.status(STATUS_CODES.OK).send({
		status: 'Online',
		creationDate: starting_date.toFixed(),
		description: 'Microservicio de pagos, utilizando un smart contract y tether.'
	});
};

module.exports = getContract;