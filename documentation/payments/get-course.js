'use strict';

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
							$ref: '#/components/schemas/Course',
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
