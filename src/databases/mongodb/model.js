'use strict';

const mongoose = require('mongoose');
const logger = require("../../helpers/logger");

module.exports = class Model {

	constructor(name, schema) {
		logger.info(`Model name: ${name}, schema: ${schema} - constructor`);
		this.model = mongoose.model(name, schema);
	}

	async find(filters = {}) {

		const items = await this.model.find(filters);

		if (!items)
			return [];

		return items.map(({ _doc }) => _doc);
	}

	async findBy(field, value) {

		const items = await this.model.find({ [field]: value });

		if (!items || !items.length)
			return [];

		return items.map(({ _doc }) => _doc);
	}

	async create(data) {
		const { _doc } = await this.model.create(data);
		return _doc;
	}

	async update(filters, data, options = {}) {
		const { ok } = await this.model.updateOne(filters, data, options);
		return !!ok;
	}

	async remove(filters) {
		return this.model.find(filters)
			.remove()
			.exec();
	}
};
