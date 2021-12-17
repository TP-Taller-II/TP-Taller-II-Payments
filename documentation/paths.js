'use strict';

const paySubscription = require('./payments/pay-subscription');

module.exports = {
	paths: {
		'/payments/v1/paySubscription': {
			...paySubscription,
		},
	},
};
