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

_For DAO with Openzeppelin Governance Release [v0.2-dev](http://github.com/DuBento/Thesis/releases/tag/v0.2-dev)_

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
|  Traceability         ·  handleTransaction             ·           -  ·          -  ·     149951  ·            1  ·       5.35  │
·······················|································|··············|·············|·············|···············|··············
|  Traceability         ·  handleUpdate                  ·           -  ·          -  ·     133635  ·            1  ·       4.77  │
·······················|································|··············|·············|·············|···············|··············
|  Traceability         ·  newBatch                      ·      198679  ·     200874  ·     200508  ·           12  ·       7.16  │
·······················|································|··············|·············|·············|···············|··············
|  TraceabilityContractFactory  ·  create                        ·           -  ·          -  ·     155491  ·            1  ·       5.55  │
·······················|································|··············|·············|·············|···············|··············
|  TraceabilityContractFactory  ·  transferOwnership             ·           -  ·          -  ·      32967  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addActor                      ·           -  ·          -  ·      93851  ·            6  ·       3.35  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addContractToActor            ·       52141  ·      73709  ·      67611  ·            5  ·       2.41  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addMember                     ·           -  ·          -  ·     118547  ·            1  ·       4.23  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  setGovernorTokenAddress       ·           -  ·          -  ·      51988  ·            1  ·       1.86  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  setTraceabilityContractFactoryAddress  ·           -  ·          -  ·      52078  ·            2  ·       1.86  │
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
|  TraceabilityContractFactory                                   ·           -  ·          -  ·    2621785  ·        8.7 %  ·      93.63  │
························································|··············|·············|·············|···············|··············
|  UserRegistry                                         ·           -  ·          -  ·    2310005  ·        7.7 %  ·      82.49  │
·-------------------------------------------------------|--------------|-------------|-------------|---------------|-------------·
```

_Afte DAO improvements and simplifications [v0.3-dev](http://github.com/DuBento/Thesis/releases/tag/v0.3-dev)_

Deployment cost improvement of around 59%.
Not considering TraceabilityContractFactory contract for cost calculations (cost has increased but is unrelated with DAO).

Calculations on 28/07/2023 with: avg gas 30 gwei/gas and 1700 eur/eth

- old deployment cost: 15477559 gas (around 789 eur)
- new deployment cost: 6382115 gas (around 358 eur)
- difference of 463 eur

```
·-------------------------------------------------------|----------------------------|-------------|-----------------------------·
|                 Solc version: 0.8.19                  ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
························································|····························|·············|······························
|  Methods                                              ·               21 gwei/gas                ·       1702.34 eur/eth       │
·······················|································|··············|·············|·············|···············|··············
|  Contract            ·  Method                        ·  Min         ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
·······················|································|··············|·············|·············|···············|··············
|  Executor            ·  transferOwnership             ·           -  ·          -  ·      32967  ·            1  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  castVoteWithReason            ·       68720  ·      88620  ·      86313  ·           18  ·       3.09  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  execute                       ·       87720  ·     187487  ·     168805  ·           14  ·       6.03  │
·······················|································|··············|·············|·············|···············|··············
|  GovernorContract    ·  propose                       ·       91130  ·      95456  ·      93267  ·           22  ·       3.33  │
·······················|································|··············|·············|·············|···············|··············
|  Traceability         ·  handleTransaction             ·           -  ·          -  ·     150162  ·            1  ·       5.37  │
·······················|································|··············|·············|·············|···············|··············
|  Traceability         ·  handleUpdate                  ·           -  ·          -  ·     133863  ·            1  ·       4.79  │
·······················|································|··············|·············|·············|···············|··············
|  Traceability         ·  newBatch                      ·      198913  ·     201108  ·     200742  ·           12  ·       7.18  │
·······················|································|··············|·············|·············|···············|··············
|  TraceabilityContractFactory  ·  create                        ·           -  ·          -  ·     138435  ·            1  ·       4.95  │
·······················|································|··············|·············|·············|···············|··············
|  TraceabilityContractFactory  ·  transferOwnership             ·           -  ·          -  ·      32967  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addActor                      ·           -  ·          -  ·      93895  ·            6  ·       3.36  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addContractToActor            ·       52163  ·      73731  ·      67633  ·            5  ·       2.42  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  addMember                     ·      127628  ·     144704  ·     139012  ·            3  ·       4.97  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  setTraceabilityContractFactoryAddress  ·           -  ·          -  ·      51989  ·            2  ·       1.86  │
·······················|································|··············|·············|·············|···············|··············
|  UserRegistry        ·  transferOwnership             ·           -  ·          -  ·      33011  ·            2  ·       1.18  │
·······················|································|··············|·············|·············|···············|··············
|  Deployments                                          ·                                          ·  % of limit   ·             │
························································|··············|·············|·············|···············|··············
|  Executor                                             ·           -  ·          -  ·    1334736  ·        4.4 %  ·      47.72  │
························································|··············|·············|·············|···············|··············
|  GovernorContract                                     ·           -  ·          -  ·    2702432  ·          9 %  ·      96.61  │
························································|··············|·············|·············|···············|··············
|  TraceabilityContractFactory                                   ·           -  ·          -  ·    2767602  ·        9.2 %  ·      98.94  │
························································|··············|·············|·············|···············|··············
|  UserRegistry                                         ·           -  ·          -  ·    2344947  ·        7.8 %  ·      83.83  │
·-------------------------------------------------------|--------------|-------------|-------------|---------------|-------------·
```

Method gas comparison:

```
CONSTANTS	gas/gwei	30
			eth/eur		1700

|  Contract				Method							avg gas:		avg eur:		diff %
														OZ DAO	our DAO	OZ DAO	our DAO
|  GovernorContract		castVoteWithReason				88961	86313	€4.54	€4.40	2.98%
|  GovernorContract		execute							298326	168805	€15.21	€8.61	43.42%
|  GovernorContract		propose							111769	93267	€5.70	€4.76	16.55%
|  GovernorContract		queue							143551	-		€7.32	-		-
|  GovernorTimelock		grantRole						40804	-		€2.08	-		-
|  GovernorTimelock		revokeRole						27746	-		€1.42	-		-
|  GovernorToken		delegate						96883	-		€4.94	-		-
|  GovernorToken		transferOwnership				32992	32967	€1.68	€1.68	0.08%
|  TraceabilityContractFactory	create							155491	138435	€7.93	€7.06	10.97%
|  TraceabilityContractFactory	transferOwnership				32967	32967	€1.68	€1.68	0.00%
|  Traceability			handleTransaction				149951	150162	€7.65	€7.66	-0.14%
|  Traceability			handleUpdate					133635	133863	€6.82	€6.83	-0.17%
|  Traceability			newBatch						200508	200742	€10.23	€10.24	-0.12%
|  UserRegistry			addActor						93851	93895	€4.79	€4.79	-0.05%
|  UserRegistry			addContractToActor				67611	67633	€3.45	€3.45	-0.03%
|  UserRegistry			addMember						118547	139012	€6.05	€7.09	-17.26%
|  UserRegistry			setGovernorTokenAddress			51988	-		€2.65	-		-
|  UserRegistry			setTraceabilityContractFactoryAddress	52078	51989	€2.66	€2.65	0.17%
|  UserRegistry			transferOwnership				33011	33011	€1.68	€1.68	0.00%
													SUM	1930670	1423061	€98.46	€72.58	26.29%
													DIFF		507609			€25.89

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

---

## Acknowledgments:

I'd like to thank [@susmonteiro](https://www.github.com/susmonteiro) for her invaluable support, and especially for sharing some of her creativity and design insights with me.
