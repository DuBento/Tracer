# Tracer

**Blockchain for Supply Chain Traceability and Governance in the Agri-food Sector**

## Description:

> Tracer provides a transparent, secure, and decentralized ledger of transactions recorded throughout the supply chain. It also incorporates an external file system to record large artifacts of product information, e.g. images, aiding consumers in making a more informed purchase decision. The reliability of our system makes for efficient product identification in the event of a food safety incident.
> Our proposal introduces a Decentralized Autonomous Organization (DAO) as the regulatory body of our system. This DAO allows for decentralized decision-making while maintaining regulatory oversight, setting it apart from other traceability systems. Moreover, the system offers user-friendly interfaces, including a consumer-oriented timeline design accessed via QR codes on product packaging.

**Demo**

https://github.com/DuBento/Tracer/assets/46141125/266f3af3-eadd-4e62-9a42-a7b7ed2109fc

[Paper](https://github.com/DuBento/Tracer/blob/main/paper.pdf)

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

#### Comparing DAO with Openzeppelin Governance Release [v0.2-dev](http://github.com/DuBento/Thesis/releases/tag/v0.2-dev) with DAO improvements and simplifications [v0.3-dev](http://github.com/DuBento/Thesis/releases/tag/v0.3-dev)

    Deployment cost improvement of around 59%.
    Not considering TraceabilityContractFactory contract for cost calculations (cost has increased but is unrelated with DAO).

    Calculations on 28/07/2023 with: avg gas 15 gwei/gas and 1540 eur/eth:
    (Considering only contracts from OpenZeppelin governance and their conterpart version made by us)
    All values considerer deployment with compiler optimizations on (1000 runs).

    - old deployment cost: 8,335,718 gas (192.55 euros).
    - new deployment cost: 2,337,982 gas (54.01 euros)
    - 71% difference

    Method gas comparison:
    50% decrease in execution costs when considering a typical governance workflow.

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

---

## Acknowledgments:

I'd like to thank [@susmonteiro](https://www.github.com/susmonteiro) for her invaluable support, and especially for sharing some of her creativity and design insights with me.
