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

describe('delete-couirse', async () => {

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

	describe('Delete Course', async () => {

		it('Should get status code 200 when course is in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);
			sandbox.stub(Model.prototype, 'remove').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/deleteCourse`)
				.send({
					course_id: fakeCourse.id,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 400 when course is not in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'remove').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/deleteCourse`)
				.send({
					course_id: fakeCourse.id,
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should get status code 400 when course_id is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);
			sandbox.stub(Model.prototype, 'remove').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/deleteCourse`)
				.send({
					password: fakeCourse.pass,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

		it('Should get status code 400 when password is missing', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);
			sandbox.stub(Model.prototype, 'remove').resolves();

			const res = await chai.request(app)
				.post(`/payments/v1/deleteCourse`)
				.send({
					course_id: fakeCourse.id,
				});

			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		});

	});
});
