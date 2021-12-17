'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const Model = require('../src/databases/mongodb/model');
const STATUS_CODES = require('../src/utils/status-codes.json');

process.env.PORT = 3030;

const app = require('../src');

chai.use(chaiHttp);

describe('get-subscription', async () => {

	const fakeUser = {
		_id: '60456ebb0190bf001f6bbee2',
		wallet_adress: '0xDF38395f37EfFFf50568065Ff9f95871ab6a62FA',
		subscription_date: 'some.email@hotmail.com',
		tier: 1,
		course_1: undefined,
		course_2: undefined,
		course_3: undefined,
	};

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Get Subscription', async () => {

		it('Should get status code 200 when user is in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeUser]);

			const res = await chai.request(app).get(`/payments/v1/getSubscription/${fakeUser._id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 400 when user is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app).get(`/payments/v1/getSubscription/${fakeUser._id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

	});
});
