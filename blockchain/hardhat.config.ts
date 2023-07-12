import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import secrets from "./secrets.json";

export const FRONTEND_ARTIFACTS_PATH = "./artifacts-frontend";

task(
  "clean",
  "Clears the cache and deletes all artifacts",
  async function (args, hre, runSuper) {
    const fs = require("fs-extra");
    console.log(`Clean extended, deleting ${FRONTEND_ARTIFACTS_PATH}...`);
    fs.removeSync(FRONTEND_ARTIFACTS_PATH);
    await runSuper(args);
  }
);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      // optimizer: {
      //   enabled: true,
      //   runs: 200,
      // },
    },
  },
  typechain: {
    outDir: `${FRONTEND_ARTIFACTS_PATH}/typechain`,
    target: "ethers-v6",
  },

  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "bdac71a5b34c869eacb68554fff7408127b70fb214d0a48fa7302261fd21bf5b",
        "6a4abc452d508ebffa74ac4abffd52af036fdd211081a277be9bc43c939a33a1",
        "58356cc7ecff39d5231d9a32d20ae1ceb55a9ab214f9e2090bef0d8394b2972a",
        "749a42a0ec429918b14cdf9a1e3fd9e7b7ee1d411ceb766aea71ed6aee447f5c",
      ],
    },
  },

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      // can add specific chaibnId: address
      // see https://github.com/wighawag/hardhat-deploy/tree/master#1-namedaccounts-ability-to-name-addresses
    },
    supplychainManager: {
      default: 1,
    },
    actor1: {
      default: 2,
    },
    actor2: {
      default: 3,
    },
    actor3: {
      default: 4,
    },
  },

  gasReporter: {
    enabled: true,
    currency: "EUR",
    gasPrice: 21,
    coinmarketcap: secrets.COIN_MARKET_CAP_API_KEY,
  },
};

export default config;
