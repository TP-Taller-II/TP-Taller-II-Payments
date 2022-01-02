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

	describe('New Course', async () => {

		it('Should create a contract when the data is properly formatted and with empty data', async () => {
			const contract_instance = await contract();
			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			assert.equal(
				0,
				await contract_instance.getCourseIncomingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course created with no starting balance"
			);
			assert.equal(
				0,
				await contract_instance.getCourseOutgoingBalance(ethers.utils.formatBytes32String(fakeCourse.id)),
				"Course created with no starting balance"
			);
		});

		it('Should revert a contract when making the same course 2 times', async () => {
			const contract_instance = await contract();
			await contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			);

			await expect(contract_instance.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			)).to.be.revertedWith('Course already exists.');
		});

		it('Should revert a contract when making the same course while not owning it', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				provider.getWallets()[2]
			);

			await expect(non_owner_contract.NewCourse(
				ethers.utils.formatBytes32String(fakeCourse.id),
				Math.trunc((new Date()).getTime() / 1000),
				ethers.utils.formatBytes32String(fakeCourse.pass),
				options
			)).to.be.revertedWith('Ownable: caller is not the owner');
		});
		
	})
});
