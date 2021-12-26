'use strict';

const { incoming_balance, outgoing_balance } = require("../../src/services/contractInteraction");

module.exports = {
	get: {
		tags: ['Course'],
		description: 'Get Course',
		operationId: 'getCourse',
		parameters: [{
			name: 'id',
			in: 'path',
			description: 'The Course Id',
			required: true,
			schema: {
				type: 'string',
				example: '5fa8bc139dcdec8512fc2604'
			}
		}],
		responses: {
			200: {
				description: 'Course data',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							description: 'The course information',
							properties: {
								course_id: {
									$ref: '#/components/schemas/Course/properties/id'
								},
								tier: {
									$ref: '#/components/schemas/Course/properties/tier'
								},
								incoming_balance: {
									type: 'integer',
									description: 'The amount of money that a course has received this month, in millionth parts of tether.',
									example: '10'
								},
								outgoing_balance: {
									type: 'integer',
									description: 'The amount of money that a course has received previous months that is available to take out, in millionth parts of tether.',
									example: '18'
								}
							}
						},
					},
				},
			},
			401: {
				description: 'Unauthorized',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/UnauthorizedError',
						},
					},
				},
			},
			500: {
				description: 'Internal server error',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/InternalServerError',
						},
					},
				},
			},
		},
	},
};
