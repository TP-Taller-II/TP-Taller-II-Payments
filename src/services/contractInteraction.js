const ethers = require("ethers");
const ethers_utils = require("ethereumjs-util");
const config = require("../../config/config");

const contract = config.contract;
const usdt = config.usdt;

const transfer_tether = async (to, amount, private_key) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await usdt()).transfer(to, amount, options);
}

const create_course = async (course_id, password) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await contract()).NewCourse(
		ethers.utils.formatBytes32String(course_id),
		Math.trunc((new Date()).getTime() / 1000),
		ethers.utils.formatBytes32String(password),
		options
	);
}

const deposit = async (course_id, amount) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await contract()).Deposit(ethers.utils.formatBytes32String(course_id), amount, options);
}

const refund = async (course_id, amount, user_adress) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await contract()).Refund(ethers.utils.formatBytes32String(course_id), amount, user_adress, options);
}

module.exports = {
	transfer_tether,
	create_course,
	deposit,
	refund,
}
