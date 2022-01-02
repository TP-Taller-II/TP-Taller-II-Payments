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
let usdt = async () => { return usdt_contract; };
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
		usdt_contract = await deployContract(usdt_wallet, require('../../deployments/test/BasicToken.json'), [1000]);
		test_contract = await deployContract(owner_wallet, require('../../deployments/rinkeby/CoursesPayout.json'), [usdt_contract.address]);
		usdt = async () => { return usdt_contract; };
		contract = async () => { return test_contract; };
	});

	afterEach(() => {
		delete process.env.PORT;
	});

	describe('Extract', async () => {

		it('The balance of the account should be correct after extraction', async () => {
			let contract_instance = await contract();
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
	
			await contract_instance.Extract(owner_wallet.address, 1);
	
			assert.equal(
				1,
				await usdt_instance.balanceOf(owner_wallet.address),
				"Owner Wallet Balance correct after change"
			);
		});

		it('If the contract doesn\'t have enough money extraction is reverted', async () => {
			let contract_instance = await contract();

			await expect(
				contract_instance.Extract(owner_wallet.address, 1)
			).to.be.revertedWith('We don\'t have enough funds');
		});

		it('If the contract doesn\'t have enough money extraction is reverted', async () => {
			const contract_instance = await contract();
			const non_owner_contract = await new ethers.Contract(
				contract_instance.address,
				require('../../deployments/rinkeby/CoursesPayout.json').abi,
				provider.getWallets()[2]
			);

			await expect(
				non_owner_contract.Extract(owner_wallet.address, 1)
			).to.be.revertedWith('Ownable: caller is not the owner');
		});
	})
});
