"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-waffle");
var dotenv_1 = require("dotenv");
require("hardhat-contract-sizer");
require("hardhat-docgen");
require("hardhat-gas-reporter");
require("hardhat-preprocessor");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
var hardhat_preprocessor_1 = require("hardhat-preprocessor");
require("hardhat-prettier");
require("hardhat-typechain");
var path_1 = require("path");
require("solidity-coverage");
// This is done to have the new matchers from waffle,
// because despite the note in https://hardhat.org/guides/waffle-testing.html?#adapting-the-tests
// the changeEtherBalance is not added because its a newer version
var chai = require("chai");
var ethereum_waffle_1 = require("ethereum-waffle");
chai.use(ethereum_waffle_1.solidity);
dotenv_1.config({ path: path_1.resolve(__dirname, "./.env") });
var chainIds = {
    ganache: 1337,
    goerli: 5,
    hardhat: 31337,
    mainnet: 1,
    kovan: 42,
    rinkeby: 4,
    ropsten: 3,
};
// Ensure that we have all the environment variables we need.
var mnemonic;
if (!process.env.MNEMONIC) {
    throw new Error("Please set your MNEMONIC in a .env file");
}
else {
    mnemonic = process.env.MNEMONIC;
}
var infuraApiKey;
if (!process.env.INFURA_API_KEY) {
    throw new Error("Please set your INFURA_API_KEY in a .env file");
}
else {
    infuraApiKey = process.env.INFURA_API_KEY;
}
var createTestnetConfig = function (network) {
    var url = "https://" + network + ".infura.io/v3/" + infuraApiKey;
    return {
        accounts: {
            count: 10,
            initialIndex: 0,
            mnemonic: mnemonic,
            path: "m/44'/60'/0'/0",
        },
        chainId: chainIds[network],
        url: url,
    };
};
var config = {
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: 0,
        sender: 1,
        receiver: 2,
    },
    networks: {
        hardhat: {
            accounts: {
                mnemonic: mnemonic,
            },
            chainId: chainIds.hardhat,
        },
        goerli: createTestnetConfig("goerli"),
        kovan: createTestnetConfig("kovan"),
        rinkeby: createTestnetConfig("rinkeby"),
        ropsten: createTestnetConfig("ropsten"),
    },
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
    solidity: {
        version: "0.8.10",
        settings: {
            // https://hardhat.org/hardhat-network/#solidity-optimizer-support
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS ? true : false,
        currency: "USD",
        gasPrice: 21,
    },
    preprocess: {
        eachLine: hardhat_preprocessor_1.removeConsoleLog(function (hre) { return !["hardhat", "localhost"].includes(hre.network.name); }),
    },
    docgen: {
        path: "./docs",
        clear: true,
        runOnCompile: false,
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map