'use strict';

module.exports = {
	get: {
		tags: ['Tier'],
		description: 'Get Tier Prices',
		operationId: 'getTierPrices',
		responses: {
			200: {
				description: 'Course deletion was sent to the chain',
				content: {
					'application/json': {
						type: 'object',
						description: 'The key in the json provides the name of the tier and the number gives the price in tethers.',
						schema: {
							properties: {
								'1': {
									type: 'integer',
									description: 'The price of the subscription in 6 decimals.',
									example: '2'
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
