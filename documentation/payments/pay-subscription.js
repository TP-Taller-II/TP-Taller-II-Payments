'use strict';

module.exports = {
	post: {
		tags: ['Subscription'],
		description: 'Pay Subscription',
		operationId: 'paySubscription',
		requestBody: {
			description: 'The data of the user that wants to pay the subscription',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						description: 'The data of the user that wants to pay the subscription',
						properties: {
							user_id: {
								$ref: '#/components/schemas/Subscription/properties/_id'
							},
							course_id: {
								$ref: '#/components/schemas/Course/properties/id'
							}
						}
					}
				}
			}	
		},
		responses: {
			200: {
				description: 'The payment has been sent to the chain',
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
