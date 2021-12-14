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

	describe('Get Course', async () => {

		it('Should get status code 200 when user is in database', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeCourse]);

			const res = await chai.request(app).get(`/payments/v1/getCourse/${fakeCourse.id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body['tier'], fakeCourse.tier);

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

	});
});
