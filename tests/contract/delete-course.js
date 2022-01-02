'use strict';

const assert = require('assert');
const { expect, use } = require('chai')
const ethers = require('ethers');
const { deployContract, MockProvider, solidity } = require('ethereum-waffle');

use(solidity);
process.env.PORT = 3030;

let provider;
let owner_wallet;
let test_contract;
let usdt_wallet;
let usdt_contract;
let usdt;
let contract = async () => { return test_contract; }
const options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };

describe('contract', async () => {

	const fakeCourse = {
		id: '12345',
		tier: 1,
		pass: "hello_world",
	};

	beforeEach(async () => {
		process.env.PORT = 3030;

		provider = new MockProvider();
		owner_wallet = provider.getWallets()[0];
		usdt_wallet = provider.getWallets()[1];
		usdt_contract = await deployContract(usdt_wallet, require('../../deployments/test/BasicToken.json'), [1000]);
		test_contract = await deployContract(owner_wallet, require('../../deployments/rinkeby/CoursesPayout.json'), [usdt_contract.address]);
		usdt = async () => {
			return usdt_contract;
		};
		contract = async () => { return test_contract; };
	});

	afterEach(() => {
		delete process.env.PORT;
	});

	describe('Delete Course', async () => {

		it('The course should not exist after being deleted correctly', async () => {
			const contract_instance = await contract();
			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);
			await contract_instance.DeleteCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await expect(contract_instance.getCourseIncomingBalance(
				ethers.utils.formatBytes32String(fakeCourse.id),
				options
			)).to.be.revertedWith('Course doesn\'t exist.');
		});

		it('The course should exist before being deleted ', async () => {
			const contract_instance = await contract();

			await expect(contract_instance.DeleteCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			)).to.be.revertedWith('Course doesn\'t exists.');
		});

		it('The course should exist before being deleted ', async () => {
			const contract_instance = await contract();
			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await expect(contract_instance.DeleteCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(""),
				options
			)).to.be.revertedWith('Wrong Password.');
		});

	})
});
