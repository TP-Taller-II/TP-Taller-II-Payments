'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const Model = require('../src/databases/mongodb/model');
const STATUS_CODES = require('../src/utils/status-codes.json');
const { MockProvider } = require('ethereum-waffle');

process.env.PORT = 3030;

const app = require('../src');
let user_wallet;

chai.use(chaiHttp);

describe('pay-subscription', async () => {

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
		user_wallet = new MockProvider().getWallets()[1];
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Pay Subscription', async () => {

		it('Should get status code 200 when send good request', async () => {
			sandbox.stub(Model.prototype, 'create').resolves();
			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app)
				.post(`/payments/v1/paySubscription/`)
				.send({
					user_id: fakeUser._id,
					wallet_pass: await user_wallet.getAddress(),
					tier: 1
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
		});

		it('Should get status code 400 when user_id is missing', async () => {
			sandbox.stub(Model.prototype, 'create').resolves();
			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app)
				.post(`/payments/v1/paySubscription/`)
				.send({
					wallet_pass: await user_wallet.getAddress(),
					tier: 1
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when wallet_pass is missing', async () => {
			sandbox.stub(Model.prototype, 'create').resolves();
			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app)
				.post(`/payments/v1/paySubscription/`)
				.send({
					user_id: fakeUser._id,
					tier: 1
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when tier is missing', async () => {
			sandbox.stub(Model.prototype, 'create').resolves();
			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app)
				.post(`/payments/v1/paySubscription/`)
				.send({
					user_id: fakeUser._id,
					wallet_pass: await user_wallet.getAddress(),
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when user already exists', async () => {
			sandbox.stub(Model.prototype, 'create').resolves();
			sandbox.stub(Model.prototype, 'findBy').resolves([fakeUser]);

			const res = await chai.request(app)
				.post(`/payments/v1/paySubscription/`)
				.send({
					user_id: fakeUser._id,
					wallet_pass: await user_wallet.getAddress(),
					tier: 1
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

	});
});
