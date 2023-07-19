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

*For DAO with Openzeppelin Governance Release [v0.2-dev](http://github.com/DuBento/Thesis/releases/tag/v0.2-dev)*

```
·-------------------------------------------------------|----------------------------|-------------|-----------------------------·
|                 Solc version: 0.8.19                  ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
························································|····························|·············|······························
|  Methods                                              ·               21 gwei/gas                ·       1700.51 eur/eth       │
·······················|································|··············|·············|·············|···············|··············
|  Contract            ·  Method                        ·  Min         ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  castVoteWithReason            ·       68296  ·      91652  ·      88961  ·           18  ·       3.18  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  execute                       ·      133407  ·     363629  ·     298326  ·           14  ·      10.65  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  propose                       ·      107346  ·     115333  ·     111769  ·           22  ·       3.99  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  queue                         ·      140058  ·     145971  ·     143551  ·           14  ·       5.13  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorTimelock    ·  grantRole                     ·       29535  ·      52073  ·      40804  ·            4  ·       1.46  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorTimelock    ·  revokeRole                    ·           -  ·          -  ·      27746  ·            2  ·       0.99  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorToken       ·  delegate                      ·           -  ·          -  ·      96883  ·            2  ·       3.46  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorToken       ·  transferOwnership             ·           -  ·          -  ·      32992  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  Supplychain         ·  handleTransaction             ·           -  ·          -  ·     149951  ·            1  ·       5.35  │
·······················|································|··············|·············|·············|···············|··············
|  Supplychain         ·  handleUpdate                  ·           -  ·          -  ·     133635  ·            1  ·       4.77  │
·······················|································|··············|·············|·············|···············|··············
|  Supplychain         ·  newBatch                      ·      198679  ·     200874  ·     200508  ·           12  ·       7.16  │
·······················|································|··············|·············|·············|···············|··············
|  SupplychainFactory  ·  create                        ·           -  ·          -  ·     155491  ·            1  ·       5.55  │
·······················|································|··············|·············|·············|···············|··············
|  SupplychainFactory  ·  transferOwnership             ·           -  ·          -  ·      32967  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addActor                      ·           -  ·          -  ·      93851  ·            6  ·       3.35  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addContractToActor            ·       52141  ·      73709  ·      67611  ·            5  ·       2.41  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addMember                     ·           -  ·          -  ·     118547  ·            1  ·       4.23  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  setGovernorTokenAddress       ·           -  ·          -  ·      51988  ·            1  ·       1.86  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  setSupplychainFactoryAddress  ·           -  ·          -  ·      52078  ·            2  ·       1.86  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  transferOwnership             ·           -  ·          -  ·      33011  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  Deployments                                          ·                                          ·  % of limit   ·             │
························································|··············|·············|·············|···············|··············
|  GovernorContract                                     ·           -  ·          -  ·    6696768  ·       22.3 %  ·     239.15  │
························································|··············|·············|·············|···············|··············
|  GovernorTimelock                                     ·           -  ·          -  ·    2495126  ·        8.3 %  ·      89.10  │
························································|··············|·············|·············|···············|··············
|  GovernorToken                                        ·           -  ·          -  ·    3975660  ·       13.3 %  ·     141.97  │
························································|··············|·············|·············|···············|··············
|  SupplychainFactory                                   ·           -  ·          -  ·    2621785  ·        8.7 %  ·      93.63  │
························································|··············|·············|·············|···············|··············
|  UserRegistry                                         ·           -  ·          -  ·    2310005  ·        7.7 %  ·      82.49  │
·-------------------------------------------------------|--------------|-------------|-------------|---------------|-------------·
```

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
