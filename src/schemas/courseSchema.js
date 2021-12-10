'use strict';

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			index: { unique: true },
			required: [true, 'An id is required'],
		},
		tier: {
			type: Number,
			required: [true, 'Tier is required'],
		},
	},
	{
		timestamps: true,
	});


courseSchema.index({ id: 1 }, { unique: true });
module.exports = courseSchema;
