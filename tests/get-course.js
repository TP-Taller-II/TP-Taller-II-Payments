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

describe('get-course', async () => {

	const fakeCourse = {
		id: '60456ebb0190bf001f6bbee8',
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

	describe('Get Course', async () => {

		it('Should get status code 200 when course is in database', async () => {

			sandbox.stub(Model.prototype, 'create').resolves();
			let stubby = sandbox.stub(Model.prototype, 'findBy');
			stubby.onCall(0).resolves([]);
			stubby.onCall(1).resolves([fakeCourse]);
			
			let res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					tier: fakeCourse.tier,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			
			res = await chai.request(app).get(`/payments/v1/getCourse/${fakeCourse.id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body['tier'], fakeCourse.tier);
		});

		it('Should get status code 400 when course is no in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app).get(`/payments/v1/getCourse/${fakeCourse.id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 404 when course_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);

			const res = await chai.request(app).get(`/payments/v1/getCourse/`);

			assert.deepStrictEqual(res.status, STATUS_CODES.NOT_FOUND);
		});

	});
});
