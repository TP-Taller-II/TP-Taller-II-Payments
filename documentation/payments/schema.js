'use strict';

module.exports = {
	Subscription: {
		type: 'object',
		properties: {
			_id: {
				type: 'string',
				description: 'The user\'s ID',
				required: true,
				example: '60456ebb0190bf001f6bbee2',
			},
			subscription_date: {
				type: 'string',
				description: 'The date the user subscribed',
				required: false
			},
			tier: {
				type: 'integer',
				description: 'The tier of the subscription',
				required: true,
				example: '1',
			},
			course_1: {
				type: 'string',
				description: 'The course 1 the user is subscribed to.',
			},
			course_2: {
				type: 'string',
				description: 'The course 2 the user is subscribed to.',
			},
			course_3: {
				type: 'string',
				description: 'The course 3 the user is subscribed to.',
			},
		},
	},
	Course: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				description: 'The user\'s ID',
				required: true,
				example: '60456ebb0190bf001f6bbee2',
			},
			tier: {
				type: 'integer',
				description: 'The tier required for the course',
				required: true,
				example: '1',
			},
		},
	},
};
