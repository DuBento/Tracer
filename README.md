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
-------------------------------------------------------|---------------------------|--------------|-----------------------------·
|                 Solc version: 0.8.19                  ·  Optimizer enabled: true  ·  Runs: 1000  ·  Block limit: 30000000 gas  │
························································|···························|··············|······························
|  Methods                                              ·               21 gwei/gas                ·       1551.31 eur/eth       │
·······················|································|·············|·············|··············|···············|··············
|  Contract            ·  Method                        ·  Min        ·  Max        ·  Avg         ·  # calls      ·  eur (avg)  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorContract    ·  castVoteWithReason            ·      65496  ·      88206  ·       85587  ·           18  ·       2.79  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorContract    ·  execute                       ·     120908  ·     346898  ·      282868  ·           14  ·       9.22  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorContract    ·  propose                       ·      99544  ·     106773  ·      103450  ·           22  ·       3.37  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorContract    ·  queue                         ·     125993  ·     131714  ·      129373  ·           14  ·       4.21  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorTimelock    ·  grantRole                     ·      28954  ·      51431  ·       40193  ·            4  ·       1.31  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorTimelock    ·  revokeRole                    ·          -  ·          -  ·       27038  ·            2  ·       0.88  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorToken       ·  delegate                      ·          -  ·          -  ·       95628  ·            2  ·       3.12  │
·······················|································|·············|·············|··············|···············|··············
|  GovernorToken       ·  transferOwnership             ·          -  ·          -  ·       31907  ·            2  ·       1.04  │
·······················|································|·············|·············|··············|···············|··············
|  Supplychain         ·  handleTransaction             ·          -  ·          -  ·      146934  ·            1  ·       4.79  │
·······················|································|·············|·············|··············|···············|··············
|  Supplychain         ·  handleUpdate                  ·          -  ·          -  ·      131847  ·            1  ·       4.30  │
·······················|································|·············|·············|··············|···············|··············
|  Supplychain         ·  newBatch                      ·     195912  ·     198086  ·      197724  ·           12  ·       6.44  │
·······················|································|·············|·············|··············|···············|··············
|  SupplychainFactory  ·  create                        ·          -  ·          -  ·      152196  ·            1  ·       4.96  │
·······················|································|·············|·············|··············|···············|··············
|  SupplychainFactory  ·  transferOwnership             ·          -  ·          -  ·       31618  ·            2  ·       1.03  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  addActor                      ·          -  ·          -  ·       93077  ·            6  ·       3.03  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  addContractToActor            ·      51776  ·      73233  ·       67201  ·            5  ·       2.19  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  addMember                     ·          -  ·          -  ·      117563  ·            1  ·       3.83  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  setGovernorTokenAddress       ·          -  ·          -  ·       50881  ·            1  ·       1.66  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  setSupplychainFactoryAddress  ·          -  ·          -  ·       50926  ·            2  ·       1.66  │
·······················|································|·············|·············|··············|···············|··············
|  UserRegistry        ·  transferOwnership             ·          -  ·          -  ·       31837  ·            2  ·       1.04  │
·······················|································|·············|·············|··············|···············|··············
|  Deployments                                          ·                                          ·  % of limit   ·             │
························································|·············|·············|··············|···············|··············
|  GovernorContract                                     ·          -  ·          -  ·     4239967  ·       14.1 %  ·     138.13  │
························································|·············|·············|··············|···············|··············
|  GovernorTimelock                                     ·          -  ·          -  ·     1697947  ·        5.7 %  ·      55.31  │
························································|·············|·············|··············|···············|··············
|  GovernorToken                                        ·          -  ·          -  ·     2397804  ·          8 %  ·      78.11  │
························································|·············|·············|··············|···············|··············
|  SupplychainFactory                                   ·          -  ·          -  ·     1663304  ·        5.5 %  ·      54.19  │
························································|·············|·············|··············|···············|··············
|  UserRegistry                                         ·          -  ·          -  ·     1396950  ·        4.7 %  ·      45.51  │
·-------------------------------------------------------|-------------|-------------|--------------|---------------|-------------·

```

_Afte DAO improvements and simplifications [v0.3-dev](http://github.com/DuBento/Thesis/releases/tag/v0.3-dev)_

Deployment cost improvement of around 59%.
Not considering TraceabilityContractFactory contract for cost calculations (cost has increased but is unrelated with DAO).

Calculations on 28/07/2023 with: avg gas 15 gwei/gas and 1540 eur/eth:
(Considering only contracts from OpenZeppelin governance and their conterpart version made by us)
All values considerer deployment with compiler optimizations on (1000 runs).

- old deployment cost: 8,335,718 gas (192.55 euros).
- new deployment cost: 2,337,982 gas (54.01 euros)
- 71% difference

```
·-------------------------------------------------------------------------|---------------------------|--------------|-----------------------------·
|                          Solc version: 0.8.19                           ·  Optimizer enabled: true  ·  Runs: 1000  ·  Block limit: 30000000 gas  │
··········································································|···························|··············|······························
|  Methods                                                                ·               21 gwei/gas                ·       1549.22 eur/eth       │
································|·········································|·············|·············|··············|···············|··············
|  Contract                     ·  Method                                 ·  Min        ·  Max        ·  Avg         ·  # calls      ·  eur (avg)  │
································|·········································|·············|·············|··············|···············|··············
|  Executor                     ·  transferOwnership                      ·          -  ·          -  ·       27056  ·            2  ·       0.88  │
································|·········································|·············|·············|··············|···············|··············
|  GovernorContract             ·  castVoteWithReason                     ·      66954  ·      86854  ·       84204  ·           18  ·       2.74  │
································|·········································|·············|·············|··············|···············|··············
|  GovernorContract             ·  execute                                ·      70673  ·     237528  ·      183898  ·           14  ·       5.98  │
································|·········································|·············|·············|··············|···············|··············
|  GovernorContract             ·  propose                                ·      85065  ·      90394  ·       88099  ·           22  ·       2.87  │
································|·········································|·············|·············|··············|···············|··············
|  Traceability                 ·  newBatch                               ·          -  ·          -  ·      154578  ·            2  ·       5.03  │
································|·········································|·············|·············|··············|···············|··············
|  TraceabilityContractFactory  ·  transferOwnership                      ·          -  ·          -  ·       27034  ·            2  ·       0.88  │
································|·········································|·············|·············|··············|···············|··············
|  UserRegistry                 ·  addActor                               ·          -  ·          -  ·      136181  ·            6  ·       4.43  │
································|·········································|·············|·············|··············|···············|··············
|  UserRegistry                 ·  addContractToActor                     ·          -  ·          -  ·       73200  ·            2  ·       2.38  │
································|·········································|·············|·············|··············|···············|··············
|  UserRegistry                 ·  addMember                              ·          -  ·          -  ·      115743  ·            2  ·       3.77  │
································|·········································|·············|·············|··············|···············|··············
|  UserRegistry                 ·  setTraceabilityContractFactoryAddress  ·          -  ·          -  ·       46112  ·            2  ·       1.50  │
································|·········································|·············|·············|··············|···············|··············
|  UserRegistry                 ·  transferOwnership                      ·          -  ·          -  ·       27068  ·            2  ·       0.88  │
································|·········································|·············|·············|··············|···············|··············
|  Deployments                                                            ·                                          ·  % of limit   ·             │
··········································································|·············|·············|··············|···············|··············
|  Executor                                                               ·          -  ·          -  ·      671286  ·        2.2 %  ·      21.84  │
··········································································|·············|·············|··············|···············|··············
|  GovernorContract                                                       ·          -  ·          -  ·     1666696  ·        5.6 %  ·      54.22  │
··········································································|·············|·············|··············|···············|··············
|  TraceabilityContractFactory                                            ·          -  ·          -  ·     1814993  ·          6 %  ·      59.05  │
··········································································|·············|·············|··············|···············|··············
|  UserRegistry                                                           ·          -  ·          -  ·     1315089  ·        4.4 %  ·      42.78  │
·-------------------------------------------------------------------------|-------------|-------------|--------------|---------------|-------------·

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
