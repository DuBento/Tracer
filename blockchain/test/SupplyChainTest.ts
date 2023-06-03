import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { SupplyChain } from "../artifacts/frontend-artifacts";
import * as Values from "./TestConfig";
import { BigNumber } from "ethers";
import { NewBatchEventObject } from "../artifacts/frontend-artifacts/SupplyChain";

describe("SupplyChain", function () {
  let supplyChain: SupplyChain;
  let owner: SignerWithAddress;
  let actor1: SignerWithAddress;
  let actor2: SignerWithAddress;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySupplyChainFixture() {
    // Contracts are deployed using the first signer/account by default
    const [primaryAccount, otherAccount1, otherAccount2] =
      await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const contract = await SupplyChain.deploy();

    return { contract, primaryAccount, otherAccount1, otherAccount2 };
  }

  async function createNewBatch(
    supplyChain: SupplyChain,
    description: string,
    hash: string
  ): Promise<BigNumber> {
    const tx = await supplyChain.newBatch(description, hash);
    const receipt = await tx.wait();

    const newBatchEvent = receipt.events?.find(
      (event) => event.event == "NewBatch"
    )?.args as unknown as NewBatchEventObject;

    return newBatchEvent.id;
  }

  beforeEach(async function () {
    const { contract, primaryAccount, otherAccount1, otherAccount2 } =
      await loadFixture(deploySupplyChainFixture);
    supplyChain = contract;
    owner = primaryAccount;
    actor1 = otherAccount1;
    actor2 = otherAccount2;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await supplyChain.isOwner()).to.equal(true);
    });
  });

  describe("Batches", function () {
    it("New batch should be properly initialized", async function () {
      const id = await createNewBatch(
        supplyChain,
        Values.BATCH_DESCRIPTION,
        Values.UPDATE_DOCUMENT_URI
      );

      const batch = await supplyChain.getBatch(id);

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.transactions).to.have.lengthOf(1);
      expect(batch.transactions[0].receiver).to.equal(owner.address);
      expect(batch.transactions[0].info.owner).to.equal(owner.address);
      expect(batch.transactions[0].info.documentURI).to.equal(
        Values.UPDATE_DOCUMENT_URI
      );
    });
  });

  describe("Supplychain updates", function () {
    let id: BigNumber;

    beforeEach(async function () {
      id = await createNewBatch(
        supplyChain,
        Values.BATCH_DESCRIPTION,
        Values.UPDATE_DOCUMENT_URI
      );
    });

    it("New update should be registered correctly", async function () {
      await supplyChain.handleUpdate(id, Values.UPDATE_DOCUMENT_URI);

      const batch = await supplyChain.getBatch(id);
      const updateIdx = batch.updates.length - 1;

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.updates[updateIdx].owner).to.equal(owner.address);
      expect(batch.updates[updateIdx].documentURI).to.equal(
        Values.UPDATE_DOCUMENT_URI
      );
    });

    xit("New update with owner address different than tx sender", async function () {
      // Skipped
      // const update: SupplyChain.UpdateStruct = {
      //   owner: actor2.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.add(1),
      // };
      // await expect(
      //   supplyChain.handleUpdate(id, update)
      // ).to.be.revertedWith("Update owner differs from message sender");
    });

    xit("New update with invalid timestamp, lower than previous update", async function () {
      // Skipped
      // const update: SupplyChain.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.sub(1),
      // };
      // await expect(
      //   supplyChain.handleUpdate(id, update)
      // ).to.be.revertedWith("Invalid update timestamp");
    });

    xit("New update with invalid timestamp, higher than block ts", async function () {
      // Skiped
      // const update: SupplyChain.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.add(9999),
      // };
      // await expect(supplyChain.handleUpdate(id, update)).to.be.revertedWith(
      //   "Invalid update timestamp"
      // );
    });

    xit("New update with invalid timestamp, lower than batch genesis", async function () {
      // const update: SupplyChain.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.sub(9999),
      // };
      // await expect(supplyChain.handleUpdate(id, update)).to.be.revertedWith(
      //   "Invalid update timestamp"
      // );
    });

    it("New update from actor that is not the current owner", async function () {
      // Change sender to normal actor
      supplyChain = supplyChain.connect(actor1);

      await expect(
        supplyChain.handleUpdate(id, Values.UPDATE_DOCUMENT_URI)
      ).to.be.revertedWith(
        "Trying to update batch while not being the current owner"
      );
    });
  });

  describe("Supplychain transactions", function () {
    let id: BigNumber;
    let batchTs: BigNumber;

    beforeEach(async function () {
      id = await createNewBatch(
        supplyChain,
        Values.BATCH_DESCRIPTION,
        Values.UPDATE_DOCUMENT_URI
      );

      const batch = await supplyChain.getBatch(id);
      batchTs = batch.transactions[0].info.ts;
    });

    it("New transaction between actors works correctly", async function () {
      await supplyChain.handleTransaction(
        id,
        actor1.address,
        Values.UPDATE_DOCUMENT_URI
      );

      const batch = await supplyChain.getBatch(id);
      const transactionIdx = batch.transactions.length - 1;

      expect(batch.id).to.equal(id);
      expect(batch.currentOwner).to.equal(actor1.address);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.transactions[transactionIdx].receiver).to.equal(
        actor1.address
      );
      expect(batch.transactions[transactionIdx].info.owner).to.equal(
        owner.address
      );
    });

    it("New transaction from actor that is not the current owner", async function () {
      // Change sender to normal actor
      supplyChain = supplyChain.connect(actor1);

      await expect(
        supplyChain.handleTransaction(
          id,
          actor2.address,
          Values.UPDATE_DOCUMENT_URI
        )
      ).to.be.revertedWith(
        "Trying to update batch while not being the current owner"
      );
    });
  });
});
