 'use strict';

require('dotenv').config()
const ethers = require('ethers');

const test_config = require('./testConfig');

const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;

const env = (process.env.NODE_ENV || 'dev').trim();

const tether_abi = [
	"function transfer(address to, uint256 amount) returns (bool)",
];

let provider = test_config.provider;
let owner_wallet = test_config.owner_wallet;
let contract = test_config.contract;
let usdt = test_config.usdt;

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
	usdt = async (private_key) => {
		const wallet = new ethers.Wallet(private_key, provider);
		return new ethers.Contract("0xD92E713d051C37EbB2561803a3b5FBAbc4962431", tether_abi, wallet);
	};
}

const defaultConfig = {
	deployerMnemonic,
	infuraApiKey,
	provider: provider,
	owner_wallet: owner_wallet,
	contract: contract,
	usdt: usdt,
	tether_abi: tether_abi,
};

const dev = {
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
