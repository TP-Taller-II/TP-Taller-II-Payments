'use strict';

module.exports = {
	post: {
		tags: ['Course'],
		description: 'Create Course',
		operationId: 'createCourse',
		requestBody: {
			description: 'The data of the course we want to create',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						description: 'The data of the course we want to create',
						properties: {
							course_id: {
								$ref: '#/components/schemas/Course/properties/id'
							},
							tier: {
								type: 'integer',
								description: 'The minimum tier of the subscription required to access the course',
								example: 1
							},
							password: {
								type: 'string',
								description: 'The password used to get the money out of the courses',
								example: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f'
							}
						}
					}
				}
			}	
		},
		responses: {
			200: {
				description: 'Course Creation sent to the chain.',
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
