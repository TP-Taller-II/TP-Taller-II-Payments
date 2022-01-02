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
const options = { gasPrice: 10000000000, gasLimit: 2000000, value: 0 };

describe('contract', async function () {
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

	describe('Deposit', async () => {

		it('The course should represent the proper money on deposit', async () => {
			let contract_instance = await contract();

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				2,
				options
			);

			assert.equal(
				1,
				await contract_instance.getCourseIncomingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
			assert.equal(
				0,
				await contract_instance.getCourseOutgoingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
		});

		it('The course should deposit should handle numbers not divisible by 2', async () => {
			let contract_instance = await contract();

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				3,
				options
			);

			assert.equal(
				1,
				await contract_instance.getCourseIncomingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
			assert.equal(
				0,
				await contract_instance.getCourseOutgoingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
		});

		it('The course should deposit correctly if the money is from the future', async () => {
			let contract_instance = await contract();

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				1609535286000,
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				3,
				options
			);

			await contract_instance.updateDate(
				ethers.utils.formatBytes32String(fakeCourse.id),
				1609535286000,
				options
			);

			await contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				3,
				options
			);

			assert.equal(
				1,
				await contract_instance.getCourseIncomingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
			assert.equal(
				1,
				await contract_instance.getCourseOutgoingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
		});

		it('The course should represent the proper money on deposit and updated month', async () => {
			let contract_instance = await contract();

			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

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

			assert.equal(
				0,
				await contract_instance.getCourseIncomingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
			assert.equal(
				1,
				await contract_instance.getCourseOutgoingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course with correct balance after deposit"
			);
		});

		it('The deposit should reverse when the course doesn\'t exist', async () => {
			let contract_instance = await contract();

			await expect(contract_instance.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				2,
				options
			)).to.be.revertedWith('Course doesn\'t exist.');

		});

		it('The deposit should reverse when not called by owner', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				provider.getWallets()[2]
			);

			await expect(non_owner_contract.Deposit(
				ethers.utils.formatBytes32String(fakeCourse.id),
				2,
				options
			)).to.be.revertedWith('Ownable: caller is not the owner');

		});

	})
});
