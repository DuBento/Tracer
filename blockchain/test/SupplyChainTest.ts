import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { SupplyChain } from "../artifacts/frontend-artifacts";
import * as Values from "./TestConfig";

describe("SupplyChain", function () {
  let supplyChain: SupplyChain;
  let sender: SignerWithAddress;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySupplyChainFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const contract = await SupplyChain.deploy();

    return { contract, owner, otherAccount };
  }

  beforeEach(async function () {
    const { contract, owner } = await loadFixture(deploySupplyChainFixture);
    supplyChain = contract;
    sender = owner;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await supplyChain.isOwner()).to.equal(true);
    });
  });

  describe("Batches", function () {
    it("New batch should be properly initialized", async function () {
      await supplyChain.newBatch(
        Values.BATCH_DESCRIPTION,
        Values.EVENT_DOCUMENT_HASH
      );

      // TODO get Id from event and check struct
      const id = 1;
      const batch = await supplyChain.getBatch(id);

      expect(batch.id).to.equal(ethers.BigNumber.from("1"));
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.events).to.have.lengthOf(1);
      expect(batch.events[0].owner).to.equal(sender.address);
      expect(batch.events[0].documentHash).to.equal(Values.EVENT_DOCUMENT_HASH);
      expect(batch.events[0].eventType).to.equal(0);
    });
  });
});
