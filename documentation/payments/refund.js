'use strict';

module.exports = {
	post: {
		tags: ['Course'],
		description: 'Refund Course',
		operationId: 'refundCourse',
		requestBody: {
			description: 'The user and the course they want to refund',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						description: 'The user and the course they want to refund',
						properties: {
							user_id: {
								$ref: '#/components/schemas/Subscription/properties/_id'
							},
							course_id: {
								$ref: '#/components/schemas/Course/properties/id'
							},
							wallet_address: {
								type: 'string',
								description: 'The private key of user\'s wallet',
								example: '0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377'
							},
						}
					}
				}
			}
		},
		responses: {
			200: {
				description: 'Course deletion was sent to the chain',
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
