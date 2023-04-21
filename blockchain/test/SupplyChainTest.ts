import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { SupplyChain } from "../typechain-types";
import * as Values from "./TestConfig";

describe("SupplyChain", function () {
  let sc: SupplyChain;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySupplyChainFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    return { supplyChain, owner, otherAccount };
  }

  beforeEach(async function () {
    const { supplyChain } = await loadFixture(deploySupplyChainFixture);
    sc = supplyChain;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sc.isOwner()).to.equal(true);
    });
  });

  describe("Batches", function () {
    it.skip("New batch should be properly initialized", async function () {
      await sc.newBatch(Values.BATCH_DESCRIPTION, Values.EVENT_DOCUMENT_HASH);

      // TODO get Id from event and check struct
    });
  });
});
