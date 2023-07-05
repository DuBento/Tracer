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
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: `${FRONTEND_ARTIFACTS_PATH}/typechain`,
    target: "ethers-v6",
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
  },

  gasReporter: {
    enabled: true,
    currency: "EUR",
    gasPrice: 21,
    coinmarketcap: secrets.COIN_MARKET_CAP_API_KEY,
  },
};

export default config;
