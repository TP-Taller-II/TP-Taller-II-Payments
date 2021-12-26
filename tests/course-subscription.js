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

describe('course-subscription', async () => {

	const fakeUser = {
		_id: '60456ebb0190bf001f6bbee9',
		wallet_adress: '0xDF38395f37EfFFf50568065Ff9f95871ab6a62FA',
		subscription_date: 'some.email@hotmail.com',
		tier: 1,
		course_1: undefined,
		course_2: undefined,
		course_3: undefined,
	};
	
	const fakeCourse = {
		id: '60456ebb0190bf001f6bbee0',
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

	describe('Course Subscription', async function () {
		this.timeout(5000)

		it('Should get status code 200 when user is in database, course exists and the user has free courses', async () => {

			let stubby = sandbox.stub(Model.prototype, 'findBy');
			stubby.onCall(0).resolves([]);
			stubby.onCall(1).callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});
			stubby.onCall(2).callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});
			
			let res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					tier: fakeCourse.tier,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			res = await chai.request(app)
				.post(`/payments/v1/courseSubscription`)
				.send({
					user_id: fakeUser._id,
					course_id: fakeCourse.id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
		});

		it('Should get status code 400 when user_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/courseSubscription`)
				.send({
					course_id: fakeCourse.id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when user_id is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [];
				return [fakeCourse];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/courseSubscription`)
				.send({
					user_id: fakeUser._id,
					course_id: fakeCourse.id,
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
				.post(`/payments/v1/courseSubscription`)
				.send({
					user_id: fakeUser._id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when course_id is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').callsFake((field, input) => {
				if (field == '_id')
					return [fakeUser];
				return [];
			});

			const res = await chai.request(app)
				.post(`/payments/v1/courseSubscription`)
				.send({
					user_id: fakeUser._id,
					course_id: fakeCourse.id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

	});
});
