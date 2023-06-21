# Thesis

### Instructions:

**Blockchain**

- _Install:_ `$npm i`
- _Node:_ `$npx hardhat node`
- _Deploy:_ `$npx hardhat run scripts/deploy.ts --network localhost`

**IPFS**

- _Kubo (server):_ `$(cd ipfs; docker-compose up -d)`
- _Interact:_ `$cp FILE ipfs/ipfs_staging; docker exec ipfs ipfs add /export/FILE`

**Frontend**

- _Install:_ `$npm i`
- _ENV:_ `$cp .env.example .env` and fill necessary values
- _Server:_ `$npm start dev`
