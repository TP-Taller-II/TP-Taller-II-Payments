'use strict';


const subscription_schemas = require('./payments/schema');

module.exports = {
	components: {
		schemas: {
			...subscription_schemas,
		},
		responses: {
			InternalServerError: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'An error occurs when trying to from Database',
					},
				},
			},
			UnauthorizedError: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Access token is missing or invalid',
					},
				},
			},
			ForbiddenError: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Access denied. Not an admin user.',
					},
				},
			},
		},
	},
	securitySchemes: {
		bearerAuth: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		},
	},
};
