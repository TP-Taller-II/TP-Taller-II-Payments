'use strict';

const status = require('./payments/status');
const courseSubscription = require('./payments/course-subscription');
const createCourse = require('./payments/create-course');
const deleteCourse = require('./payments/delete-course');
const getContract = require('./payments/get-contract');
const getCourse = require('./payments/get-course');
const getSubscription = require('./payments/get-subscription');
const getTierPrices = require('./payments/get-tier-prices');
const paySubscription = require('./payments/pay-subscription');
const refund = require('./payments/refund');

module.exports = {
	paths: {
		'/payments/status': {
			...status,
		},
		'/payments/v1/courseSubscription': {
			...courseSubscription,
		},
		'/payments/v1/createCourse': {
			...createCourse,
		},
		'/payments/v1/deleteCourse': {
			...deleteCourse,
		},
		'/payments/v1/getContract': {
			...getContract,
		},
		'/payments/v1/getCourse/{id}': {
			...getCourse,
		},
		'/payments/v1/getSubscription/{id}': {
			...getSubscription,
		},
		'/payments/v1/getTierPrices': {
			...getTierPrices,
		},
		'/payments/v1/paySubscription': {
			...paySubscription,
		},
		'/payments/v1/refund': {
			...refund,
		},
	},
};
