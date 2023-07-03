# Thesis

## Instructions:

**Blockchain**

- _Install:_ `$npm i`
- _Node:_ `$npx hardhat node`
- _Deploy:_ `$npx hardhat run scripts/deploy.ts --network localhost`

**Frontend**

- _Install:_ `$npm i`
- _ENV:_ `$cp .env.example .env` and fill necessary values
- _Server:_ `$npm start dev`

**IPFS**

- _Kubo (server):_ `$(cd ipfs; docker-compose up -d)`
- _Interact:_ `$cp FILE ipfs/ipfs_staging; docker exec ipfs ipfs add /export/FILE`

---

## Report

**Gas report**

- hardhat gas-reporter: run test `npx hardhat test`

---

## Resources

**DAO:**

- OpenZeppelin: as an inspiration [Governance](https://docs.openzeppelin.com/contracts/4.x/governance)
- Guide to deploy OpenZeppelin Governance contract: [dao-template by PatrickAlphaC](https://github.com/PatrickAlphaC/dao-template)

---

## Technologies

**Blockchain**

_Hardhat_ as development framework, using extensions:
- hardhat-ethers, for integration with ethersjs
- hardhat-deploy, for deployment scripts
- gas-reporter, for reports on gas cost (usage and deployment)

Smart contracts written in Solidity.
Scripts and tests written in Typescript.

Developed for EVM compatible blockchains (Ethereum).

**Frontend**

_Next.js_ as development framework, using:
- React, library for building frontend
- TailwindCSS, a CSS styling framework
- Ethers, a library for interacting with Ethereum and Ethereum-like blockchains.
- swr, a React library for remote data fetching and caching.
- react-hot-toast, a toast notification library for React. 

All files written with Typescript.

**IPFS**

- For development, using a Docker container running [Kubo](https://hub.docker.com/r/ipfs/kubo/) (default IPFS implementation in Go)
- For production or other, possible to use external pining services and gateways like [pinata](https://www.pinata.cloud/) 
