'use strict';

module.exports = {
	get: {
		tags: ['Contract'],
		description: 'Get Contract',
		operationId: 'getContract',
		responses: {
			200: {
				description: 'Address',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							description: 'The address of the contract',
							properties: {
								address: {
									type: 'string',
									description: 'The address of the contract',
									example: '0xab8398CC6581583267CF6C622BFf9052936386b9'
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
