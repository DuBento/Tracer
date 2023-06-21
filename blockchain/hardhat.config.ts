import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "./artifacts/frontend-artifacts",
    target: "ethers-v5",
  },
};

export default config;
