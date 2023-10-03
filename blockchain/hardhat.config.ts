import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import { FRONTEND_ARTIFACTS_PATH } from "./properties";
import secrets from "./secrets.json";

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

// task(
//   "deploy",
//   "Deploy contracts and clears old addresses file",
//   async function (args, hre, runSuper) {
//     await hre.run("clean-contract-addresses");
//     await runSuper(args);
//   }
// );

// task(
//   "node",
//   "Starts a JSON-RPC server on top of Hardhat EVM",
//   async function (args, hre, runSuper) {
//     await hre.run("clean-contract-addresses");
//     await runSuper(args);
//   }
// );

// subtask("clean-contract-addresses", "Clears old addresses file").setAction(
//   async (taskArgs) => {
//     const fs = require("fs-extra");
//     console.log(`Deploy extended, deleting ${CONTRACT_ADDRESS_FILE}...`);
//     fs.removeSync(CONTRACT_ADDRESS_FILE);
//   }
// );

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  typechain: {
    outDir: `${FRONTEND_ARTIFACTS_PATH}/typechain`,
    target: "ethers-v6",
  },

  etherscan: {
    apiKey: secrets.ETHERSCAN_API_KEY,
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
        "28bf05573c891dfa836717172070fbbb559f8a76a92a21b7cf9882e059734cff",
        "947b64ba0bde5a57bdce270c97c5f42417bf336ef9132d03c4ec9787c831a1fe",
        "acaa1eb48f4f0adab518933031c1e9ef1d45037ff37d49a65c4e924f62b7991b",
        "6775960100699c1cf3352efbd4372cebf012d6a11f18cefc4241daed821d664b",
        "55adaaab3de0ba80936846ed119a0e4e63b12bb27eb5cf30d36abaa40aecf3e6",
        "9fd91fd1de3bd4f17fe4a5e5edbbb171744bdf8a3c86a3292f048d81b9627117",
        "0a541c7d6a442ab5892d22bada49174118a0a8cf2ccba6b8f972a1f3bbbfe129",
      ],
    },
    sepolia: {
      url: secrets.ETHEREUM_PROVIDER_URL,
      accounts: secrets.SEPOLIA_ACCOUNTS,
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
    actor4: {
      default: 5,
    },
    actor5: {
      default: 6,
    },
  },

  gasReporter: {
    enabled: true,
    currency: "EUR",
    gasPrice: 21,
    // showTimeSpent: true,
    coinmarketcap: secrets.COIN_MARKET_CAP_API_KEY,
  },
};

export default config;
