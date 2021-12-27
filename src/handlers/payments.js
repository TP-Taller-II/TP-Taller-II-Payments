'use strict';

const STATUS_CODES = require('../utils/status-codes.json');
const payments = require('../services/payments');
const { outgoing_balance } = require('../services/contractInteraction');
const logger = require("../helpers/logger");

const getContract = async (req, res) => {
	try {
		res.status(STATUS_CODES.OK).send({ address: await payments.getContract() });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getTierPrices = async (req, res) => {
	try {
		res.status(STATUS_CODES.OK).send({ tiers: await payments.getTierPrices() });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const paySubscription = async (req, res) => {
	try {
		const { user_id, wallet_pass, tier } = req.body;

		// Validacion de los datos
		if (!user_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing user id.' });

		const user = await payments.getSubscription(user_id);
		if (user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User already exists." });

		if (!wallet_pass)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing wallet password.' });

		if (!tier)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing tier.' });

		if (!payments.tiers[parseInt(tier)])
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid tier.' });

		await payments.paySubscription(user_id, wallet_pass, parseInt(tier));

		res.status(STATUS_CODES.OK).send({ message: "Payment sent to the chain." });
	} catch (error) {
		logger.error(error);
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getSubscription = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing user id.' });

		const user = await payments.getSubscription(id);

		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User not found." });

		return res.status(STATUS_CODES.OK).send({
			subscription_date: user.subscription_date,
			tier: user.tier,
			course_1: user.course_1 || "Subscription open",
			course_2: user.course_2 || "Subscription open",
			course_3: user.course_3 || "Subscription open",
		});
	} catch (error) {
		logger.error(error);
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const deleteSubscription = async (req, res) => {
	try {
		const { user_id } = req.body;

		if (!user_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing user id.' });

		const user = await payments.getSubscription(user_id);

		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User not found." });

		await payments.deleteSubscription(user_id);
		return res.status(STATUS_CODES.OK).send({ message: "Subscription deleted." })
	} catch (error) {
		console.error(error);
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const courseSubscription = async (req, res) => {
	try {
		const { user_id, course_id } = req.body;

		// Validacion de los datos
		if (!user_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing user id.' });

		const user = await payments.getSubscription(user_id);
		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User not found." });

		if (!course_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course id.' });

		const course = await payments.getCourse(course_id);
		if (!course)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "Course not found." });

		if (user.course_1 && user.course_2 && user.course_3)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User is already in 3 courses." });

		if (user.tier < course.tier)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User tier doesn't have access to the course." });

		if (user.course_1 == course_id || user.course_2 == course_id || user.course_3 == course_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User already in course." });

		let course_pos = "course_3"
		if (!user.course_1) {
			course_pos = "course_1"
		} else if (!user.course_2) {
			course_pos = "course_2"
		}

		await payments.courseSubscription(user_id, course_id, course_pos, user.tier);

		res.status(STATUS_CODES.OK).send({ message: "Student was sucessfully added to course." });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const createCourse = async (req, res) => {
	try {
		const { course_id, tier, password } = req.body;

		if (!course_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course id.' });

		if (!tier)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing tier.' });

		if (!payments.tiers[parseInt(tier)])
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid tier.' });

		if (!password)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing password.' });

		const course = await payments.getCourse(course_id);
		if (course)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "Course already exists." });

		await payments.createCourse(course_id, parseInt(tier), password);

		res.status(STATUS_CODES.OK).send({ message: "Course Creation sent to the chain." });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getCourse = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course id.' });

		const course = await payments.getCourse(id)

		if (!course)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Course does not exist.' });

		res.status(STATUS_CODES.OK).send({
			course_id: course.id,
			tier: course.tier,
			outgoing_balance: await payments.outgoing_balance(id),
			incoming_balance: await payments.incoming_balance(id),
		});
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const deleteCourse = async (req, res) => {
	try {
		const { course_id, password } = req.body;

		if (!course_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course id.' });

		if (!password)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course password.' });

		const course = await payments.getCourse(course_id)

		if (!course)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Course does not exist.' });

		await payments.deleteCourse(course_id, password);

		res.status(STATUS_CODES.OK).send({ message: 'Course deletion was sent to the chain.' });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const refund = async (req, res) => {
	try {
		const { course_id, user_id, wallet_address } = req.body;

		// Validacion de los datos
		if (!user_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing user id.' });

		const user = await payments.getSubscription(user_id);
		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "User not found." });

		if (!course_id)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing course id.' });

		const course = await payments.getCourse(course_id);
		if (!course)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: "Course not found." });

		if (!wallet_address)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Missing wallet adress.' });

		let course_pos = undefined
		if (user.course_1 == course_id) {
			course_pos = "course_1"
		} else if (user.course_2 == course_id) {
			course_pos = "course_2"
		} else if (user.course_3 == course_id) {
			course_pos = "course_3"
		}

		if (!course_pos)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'User is not assigned to that resource.' });

		payments.refund(user_id, user.tier, course_pos, course_id, wallet_address);

		res.status(STATUS_CODES.OK).send({ message: "Refund sent to the chain." });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

module.exports = {
	getContract,
	getTierPrices,
	paySubscription,
	courseSubscription,
	deleteSubscription,
	getSubscription,
	createCourse,
	deleteCourse,
	getCourse,
	refund,
}
