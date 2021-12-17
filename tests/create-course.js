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

describe('create-course', async () => {

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

	describe('Create Course', async () => {

		it('Should get status code 200 when data is correct', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'create').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					tier: fakeCourse.tier,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 400 when course already exists', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);
			sandbox.stub(Model.prototype, 'create').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					tier: fakeCourse.tier,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 400 when course_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'create').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					tier: fakeCourse.tier,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when tier is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'create').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when password is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'create').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/createCourse`)
				.send({
					course_id: fakeCourse.id,
					tier: fakeCourse.tier,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

	});
});
