'use strict';

require('dotenv').config()
const ethers = require('ethers');
const { deployContract, MockProvider } = require('ethereum-waffle');

const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;

const env = process.env.NODE_ENV.trim() || 'dev';

const tether_abi = [
	"function transfer(address to, uint256 amount) returns (bool)",
];

let provider = new MockProvider();
let owner_wallet = new MockProvider().getWallets()[0];
let contract = async () => { return deployContract(owner_wallet, require('../deployments/rinkeby/CoursesPayout.json')) };
let usdt = async () => { return deployContract(owner_wallet, require('../deployments/test/BasicToken.json'), [1000]) };


if (env != "test") {
	provider = new ethers.providers.InfuraProvider('rinkeby', infuraApiKey);
	owner_wallet = ethers.Wallet.fromMnemonic(deployerMnemonic).connect(provider);
	contract = async () => {
		return new ethers.Contract(
			require(`../deployments/rinkeby/CoursesPayout.json`).address,
			require(`../deployments/rinkeby/CoursesPayout.json`).abi,
			owner_wallet
		);
	};
	usdt = async () => { return new ethers.Contract("0xD92E713d051C37EbB2561803a3b5FBAbc4962431", tether_abi, owner_wallet); };
}

const defaultConfig = {
	deployerMnemonic,
	infuraApiKey,
	provider: provider,
	owner_wallet: owner_wallet,
	contract: contract,
	usdt: usdt,
};

const dev = {
	...defaultConfig,
	contractAddress: require(`../deployments/rinkeby/CoursesPayout.json`).address,
	contractAbi: require(`../deployments/rinkeby/CoursesPayout.json`).abi,
	network: "rinkeby",
};

const test = {
	...dev,
	db: {
		protocol: 'mongodb',
		host: 'localhost:27017',
		name: 'authServerDB',
	},
};

const docker = {
	...dev,
	db: {
		protocol: 'mongodb',
		host: 'mongo:27017',
		name: '',
	},
};

const prod = {
	...defaultConfig,
	contractAddress: require(`../deployments/rinkeby/CoursesPayout.json`).address,
	contractAbi: require(`../deployments/rinkeby/CoursesPayout.json`).abi,
	network: "rinkeby",
	db: {
		protocol: 'mongodb+srv',
		host: `ubademy-g2:${process.env.MONGO_DB_PASS}@auth-server.i7qbi.mongodb.net`,
		opts: 'retryWrites=true&w=majority',
	},
};

const config = {
	dev,
	docker,
	prod,
	test,
};

module.exports = config[env];
