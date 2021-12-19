'use strict';

module.exports = {
	get: {
		tags: ['Status'],
		description: 'Get Status',
		operationId: 'status',
		responses: {
			200: {
				description: 'The status of the server',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							description: 'The status of the server',
							properties: {
								status: {
									type: 'string',
									description: 'The condition of the server',
									example: 'Online'
								},
								creationDate: {
									type: 'integer',
									description: 'The date of the moment the server started, with epoch time with miliseconds',
									example: 1639893485660
								},
								description: {
									type: 'string',
									description: 'A short description',
									example: 'A short description'
								}
							}
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
