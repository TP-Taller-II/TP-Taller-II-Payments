'use strict';

const ethers = require('ethers');
const { deployContract, MockProvider } = require('ethereum-waffle');


const existCourse = {
    id: '60456ebb0190bf001f6bbee0',
    tier: 1,
    pass: "hello_world",
};

let provider = new MockProvider();
let owner_wallet = provider.getWallets()[0];
let test_contract = deployContract(owner_wallet, require('../deployments/rinkeby/CoursesPayout.json'))
let contract = async () => { return test_contract };
let usdt = async (private_key) => {
	const wallet = new ethers.Wallet(private_key, provider);
	return deployContract(wallet, require('../deployments/test/BasicToken.json'), [1000])
};

module.exports = {
    provider,
    owner_wallet,
    contract,
    usdt
}