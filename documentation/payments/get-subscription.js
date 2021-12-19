'use strict';

module.exports = {
	get: {
		tags: ['Subscription'],
		description: 'Get Subscription',
		operationId: 'getSubscription',
		parameters: [{
			name: 'id',
			in: 'path',
			description: 'The User Id',
			required: true,
			schema: {
				type: 'string',
				example: '5fa8bc139dcdec8512fc2604'
			}
		}],
		responses: {
			200: {
				description: 'Data of the subscription asked for',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Subscription',
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
