'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const STATUS_CODES = require('../src/utils/status-codes.json');

process.env.PORT = 3030;

const app = require('../src');
const payments_service = require('../src/services/payments');

chai.use(chaiHttp);

describe('get-tier-prices', async () => {

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Get Tier Prices', async () => {

		it('Should get status code 200 and give back the correct tier prices', async () => {

			const res = await chai.request(app).get(`/payments/v1/getTierPrices`);

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			assert.deepStrictEqual(res.body['tiers'], payments_service.tiers);
		});

	});
});
