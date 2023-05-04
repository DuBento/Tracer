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
        Values.EVENT_DOCUMENT_HASH
      );

      const batch = await supplyChain.getBatch(id);

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.events).to.have.lengthOf(1);
      expect(batch.events[0].owner).to.equal(owner.address);
      expect(batch.events[0].documentHash).to.equal(Values.EVENT_DOCUMENT_HASH);
      expect(batch.events[0].eventType).to.equal(0);
    });
  });

  describe("Supplychain events", function () {
    let id: BigNumber;
    let batchTs: BigNumber;

    beforeEach(async function () {
      id = await createNewBatch(
        supplyChain,
        Values.BATCH_DESCRIPTION,
        Values.EVENT_DOCUMENT_HASH
      );

      const batch = await supplyChain.getBatch(id);
      batchTs = batch.events[0].ts;

      // Change sender to normal actor
      supplyChain = supplyChain.connect(actor1);
    });

    it("New event should be registered correctly", async function () {
      const event: SupplyChain.EventStruct = {
        owner: actor1.address,
        documentHash: Values.EVENT_DOCUMENT_HASH,
        ts: batchTs.add(1),
        eventType: 1,
      };

      await supplyChain.handleEvent(id, event);

      const batch = await supplyChain.getBatch(id);
      const eventIdx = batch.events.length - 1; // second event

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.events).to.have.lengthOf(2);
      expect(batch.events[eventIdx].owner).to.equal(actor1.address);
      expect(batch.events[eventIdx].documentHash).to.equal(
        Values.EVENT_DOCUMENT_HASH
      );
      expect(batch.events[eventIdx].eventType).to.equal(1);
    });

    it("New event with owner address different than tx sender", async function () {
      const event: SupplyChain.EventStruct = {
        owner: actor2.address,
        documentHash: Values.EVENT_DOCUMENT_HASH,
        ts: batchTs.add(1),
        eventType: 1,
      };

      await expect(supplyChain.handleEvent(id, event)).to.be.revertedWith(
        "Event owner differs from message sender"
      );
    });

    it("New event with invalid timestamp, lower than previous event", async function () {
      const event: SupplyChain.EventStruct = {
        owner: actor1.address,
        documentHash: Values.EVENT_DOCUMENT_HASH,
        ts: batchTs.sub(1),
        eventType: 1,
      };

      await expect(supplyChain.handleEvent(id, event)).to.be.revertedWith(
        "Invalid event timestamp"
      );
    });

    it("New event with invalid timestamp, higher than block ts", async function () {
      const event: SupplyChain.EventStruct = {
        owner: actor1.address,
        documentHash: Values.EVENT_DOCUMENT_HASH,
        ts: batchTs.add(9999),
        eventType: 1,
      };

      await expect(supplyChain.handleEvent(id, event)).to.be.revertedWith(
        "Invalid event timestamp"
      );
    });

    it("New event with invalid timestamp, lower than batch genesis", async function () {
      const event: SupplyChain.EventStruct = {
        owner: actor1.address,
        documentHash: Values.EVENT_DOCUMENT_HASH,
        ts: batchTs.sub(9999),
        eventType: 1,
      };

      await expect(supplyChain.handleEvent(id, event)).to.be.revertedWith(
        "Invalid event timestamp"
      );
    });
  });
});
