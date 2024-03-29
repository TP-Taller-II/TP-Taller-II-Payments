'use strict';

const config = require("../../config/config");
const contractService = require("../services/contractInteraction");
const Model = require("../databases/mongodb/model");
const userSchema = require("../schemas/userSchema");
const courseSchema = require("../schemas/courseSchema");

const tiers = { 1: 6, 2: 12, 3: 18 };

const userModel = new Model('subscriptions', userSchema);
const courseModel = new Model('contractcourses', courseSchema);

const getContract = async () => {
	return config.contractAddress;
};

const getTierPrices = async () => {
	return tiers;
};

const paySubscription = async (user_id, wallet_pass, tier) => {
	try {
		let value = await contractService.transfer_tether(config.contractAddress, tiers[tier], wallet_pass);
		value.wait(1);
		userModel.create({
			_id: user_id,
			subscription_date: Date.now(),
			tier: tier,
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const deleteSubscription = async (user_id) => {
	userModel.remove({ _id: user_id });
};

const getSubscription = async (user_id) => {
	const [user] = await userModel.findBy('_id', user_id);

	return user;
}

const courseSubscription = async (user_id, course_id, course_pos, tier) => {
	let data = {}
	data[course_pos] = course_id;
	contractService.deposit(course_id, tiers[tier]/3).then(
		() => {
			userModel.update({ _id: user_id }, data);
		},
		error => {
			console.error(error);
		}
	);
};

const createCourse = async (course_id, tier, password) => {
	try {
		await contractService.create_course(course_id, password);
		courseModel.create({
			id: course_id,
			tier: tier,
		});
	}
	catch (error) {
		console.error(error);
	};
};

const getCourse = async (course_id) => {
	const [course] = await courseModel.findBy('id', course_id);

	return course;
}

const deleteCourse = async (course_id, password) => {
	contractService.delete_course(course_id, password).then(
		() => {
			courseModel.remove({ id: course_id });
		},
		error => {
			console.error(error);
		}
	);
}

const refund = async (user_id, tier, course_pos, course_id, wallet_address) => {
	let data = {}
	data[course_pos] = undefined;
	contractService.refund(course_id, tiers[tier] / 3, wallet_address).then(
		() => {
			userModel.update({ _id: user_id }, data);
		},
		error => {
			console.error(error);
		}
	);
};

module.exports = {
	getContract,
	getTierPrices,
	paySubscription,
	deleteSubscription,
	courseSubscription,
	getSubscription,
	createCourse,
	deleteCourse,
	getCourse,
	refund,
	tiers,
	outgoing_balance: contractService.outgoing_balance,
	incoming_balance: contractService.incoming_balance,
}