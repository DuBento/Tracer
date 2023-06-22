import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

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
    outDir: "./artifacts/frontend-artifacts",
    target: "ethers-v6",
  },
};

export default config;
