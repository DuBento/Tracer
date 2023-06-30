import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { HardhatUserConfig, task } from "hardhat/config";

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
  },
};

export default config;
