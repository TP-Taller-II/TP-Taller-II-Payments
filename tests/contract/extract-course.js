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
let user_wallet;
let usdt_contract;
let usdt;
let contract = async () => { return test_contract; }
const options = { gasPrice: 1000000000, gasLimit: 85000, value: 0 };

describe('contract', async () => {
	this.timeout(10000);

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
		user_wallet = provider.getWallets()[2];
		usdt_contract = await deployContract(usdt_wallet, require('../../deployments/test/BasicToken.json'), [1000]);
		test_contract = await deployContract(owner_wallet, require('../../deployments/rinkeby/CoursesPayout.json'), [usdt_contract.address]);
		usdt = async () => { return usdt_contract; };
		contract = async () => { return test_contract; };
	});

	afterEach(() => {
		delete process.env.PORT;
	});

	describe('Extract Course', async () => {

		it('The balance of the account should be correct after extraction', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				user_wallet
			);
			let usdt_instance = await usdt();

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await usdt_instance.transfer(contract_instance.address, 2);

			await contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				2,
				options
			);

			await contract_instance.updateDate(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				options
			);

			await non_owner_contract.ExtractCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			assert.equal(
				1,
				await usdt_instance.balanceOf(user_wallet.address),
				"Owner Wallet Balance correct after change"
			);
		});

		it('Extract should reverse if the course doesn\'t exist', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				user_wallet
			);

			await expect(non_owner_contract.ExtractCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			)).to.be.revertedWith("Course doesn't exist.");

		});

		it('Extract should reverse if not the correct password', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				user_wallet
			);

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await expect(non_owner_contract.ExtractCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				ethers.utils.formatBytes32String(""),
				options
			)).to.be.revertedWith("Wrong Password.");

		});
	});
});
