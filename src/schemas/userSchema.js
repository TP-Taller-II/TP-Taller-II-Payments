'use strict';

const mongoose = require('mongoose');

// profile pic missing
const userSchema = new mongoose.Schema(
	{
		subscription_date: {
			type: Date,
		},
		tier: {
			type: Number,
		},
		course_1: {
			type: String,
		},
		course_2: {
			type: String,
		},
		course_3: {
			type: String,
		},
	},
	{
		timestamps: true,
	});

module.exports = userSchema;
