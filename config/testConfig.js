'use strict';

const ethers = require('ethers');
const { deployContract, MockProvider } = require('ethereum-waffle');

let provider = new MockProvider();
let owner_wallet = provider.getWallets()[0];
let usdt_wallet = provider.getWallets()[1];
let test_contract;
let usdt_contract;
deployContract(usdt_wallet, require('../deployments/test/BasicToken.json'), [1000]).then((result) => {
    usdt_contract = result;
    test_contract = deployContract(owner_wallet, require('../deployments/rinkeby/CoursesPayout.json'), [result.address]);
});
let contract = async () => {
    return await test_contract;
};
let usdt = async (private_key) => {
    return await usdt_contract;
};

module.exports = {
    provider,
    owner_wallet,
    contract,
    usdt
}