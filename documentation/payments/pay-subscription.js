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
							wallet_pass: {
								type: 'string',
								description: 'The private key of user\'s wallet',
								example: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f'
							},
							tier: {
								type: 'integer',
								description: 'The tier of the subscription',
								example: 1
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
