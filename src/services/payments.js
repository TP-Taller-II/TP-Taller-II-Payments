'use strict';

const config = require("../../config/config");
const contractService = require("../services/contractInteraction");
const Model = require("../databases/mongodb/model");
const userSchema = require("../schemas/userSchema");
const courseSchema = require("../schemas/courseSchema");

const tiers = { 1: 6, 2: 12, 3: 18 };

const userModel = new Model('users', userSchema);
const courseModel = new Model('courses', courseSchema);

const getContract = async () => {
	return config.contractAddress;
};

const getTierPrices = async () => {
	return tiers;
};

const paySubscription = async (user_id, wallet_pass, tier) => {
	contractService.transfer_tether(config.contractAddress, tiers[tier], wallet_pass).then(
		() => {
			userModel.create({
				_id: user_id,
				subscription_date: Date.now(),
				tier: tier,
			});
		},
		error => {
			console.error(error);
		}
	);
};

const deleteSubscription = async (user_id) => {
	userModel.remove({ _id: user_id });
};

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

const getSubscription = async (user_id) => {
	const [user] = await userModel.findBy('_id', user_id);

	return user;
}

const createCourse = async (course_id, tier, password) => {
	contractService.create_course(course_id, password).then(
		() => {
			courseModel.create({
				id: course_id,
				tier: tier,
			});
		},
		error => {
			console.error(error);
		}
	);
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
}