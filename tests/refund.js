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

describe('refund', async () => {

	const fakeUser = {
		_id: '60456ebb0190bf001f6bbee2',
		wallet_adress: '0xDF38395f37EfFFf50568065Ff9f95871ab6a62FA',
		subscription_date: 'some.email@hotmail.com',
		tier: 1,
		course_1: '60456ebb0190bf001f6bbee1',
		course_2: undefined,
		course_3: undefined,
	};

	const fakeUser1 = {
		_id: '60456ebb0190bf001f6bbee2',
		wallet_adress: '0xDF38395f37EfFFf50568065Ff9f95871ab6a62FA',
		subscription_date: 'some.email@hotmail.com',
		tier: 1,
		course_1: undefined,
		course_2: undefined,
		course_3: undefined,
	};

	const fakeCourse = {
		id: '60456ebb0190bf001f6bbee1',
		tier: 1,
		pass: "hello_world",
	};

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Post Refund', async () => {

		it('Should get status code 200 when request correct', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					course_id: fakeCourse.id,
					user_id: fakeUser._id,
					wallet_address: fakeUser.wallet_adress
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			sandbox.assert.calledTwice(Model.prototype.findBy);
		});

		it('Should get status code 400 when user_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					course_id: fakeCourse.id,
					wallet_address: fakeUser.wallet_adress
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when course_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					user_id: fakeUser._id,
					wallet_address: fakeUser.wallet_adress
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when wallet_address is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					course_id: fakeCourse.id,
					user_id: fakeUser._id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when user is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					course_id: fakeCourse.id,
					user_id: fakeUser._id,
					wallet_address: fakeUser.wallet_adress
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when course is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/refund`)
				.send({
					course_id: fakeCourse.id,
					user_id: fakeUser._id,
					wallet_address: fakeUser.wallet_adress
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

	});
});
