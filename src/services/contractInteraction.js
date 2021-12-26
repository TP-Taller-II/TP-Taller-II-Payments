const ethers = require("ethers");
const config = require("../../config/config");

const contract = config.contract;
const usdt = config.usdt;

const transfer_tether = async (to, amount, private_key) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await usdt(private_key)).transfer(to, amount, options);
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

const delete_course = async (course_id, password) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await contract()).DeleteCourse(
		ethers.utils.formatBytes32String(course_id),
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

const extract = async (to, amount) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await contract()).extract(to, amount, options);
}

const incoming_balance = async (course_id) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await (await contract()).getCourseIncomingBalance(ethers.utils.formatBytes32String(course_id))).toNumber();
}

const outgoing_balance = async (course_id) => {
	var options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };
	return (await (await contract()).getCourseOutgoingBalance(ethers.utils.formatBytes32String(course_id))).toNumber();
}

module.exports = {
	transfer_tether,
	create_course,
	delete_course,
	deposit,
	refund,
	extract,
	incoming_balance,
	outgoing_balance
}
