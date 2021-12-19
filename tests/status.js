'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const STATUS_CODES = require('../src/utils/status-codes.json');

process.env.PORT = 3030;

const app = require('../src');

chai.use(chaiHttp);

describe('get-status', async () => {

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Get Status', async () => {

		it('Should get status code 200 always and return status', async () => {
			const res = await chai.request(app).get(`/payments/status`);

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
		});

	});
});
