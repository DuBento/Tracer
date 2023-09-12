import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import {
  Traceability,
  TraceabilityContractFactory,
  UserRegistry,
} from "../artifacts-frontend/typechain";
import { newBatch, utils } from "../lib";
import { SUPPLYCHAIN_CONTRACT_DESCRIPTION } from "../properties";
import * as Values from "./TestConfig";

/* 
 TODO:
  - Test transfer ownership
*/

describe("Traceability", function () {
  var Traceability: Traceability;
  var supplyChainAddress: string;
  var deployer: string;
  var manager: string;
  var batchOwner: string;
  var actor1: string;
  var actor2: string;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySupplychainFixture() {
    // Contracts are deployed using the first signer/account by default
    const { deployer, supplychainManager, actor1, actor2, actor3 } =
      await getNamedAccounts();

    await deployments.fixture("dao_addons");

    // Add Traceability manager as memeber to user registry
    const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
    await userRegistry.addMember(
      supplychainManager,
      Values.MEMBER_NAME,
      Values.MEMBER_INFO_URI,
      Values.MEMBER_VOTING_POWER
    );

    // Create new Traceability contract
    const TraceabilityContractFactory =
      await utils.getContract<TraceabilityContractFactory>(
        "TraceabilityContractFactory",
        { signerAddress: deployer }
      );
    await TraceabilityContractFactory.create(
      supplychainManager,
      SUPPLYCHAIN_CONTRACT_DESCRIPTION
    );

    const contractAddress = (await userRegistry.getMember(supplychainManager))
      .managingContractAddress;

    // Add allowed actor
    await Promise.all([
      userRegistry.addContractToActor(contractAddress, actor1),
      userRegistry.addContractToActor(contractAddress, actor1),
      userRegistry.addContractToActor(contractAddress, actor2),
    ]);

    const contract = await utils.getContract<Traceability>("Traceability", {
      contractAddress: contractAddress,
      signerAddress: actor1,
    });

    return {
      contract,
      contractAddress,
      deployer,
      supplychainManager,
      actor1,
      actor2,
      actor3,
    };
  }

  beforeEach(async function () {
    const values = await loadFixture(deploySupplychainFixture);
    Traceability = values.contract;
    supplyChainAddress = values.contractAddress;
    deployer = values.deployer;
    manager = values.supplychainManager;
    batchOwner = values.actor1;
    actor1 = values.actor2;
    actor2 = values.actor3;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await Traceability.owner()).to.equal(deployer);
    });
  });

  describe("Batches", function () {
    it("New batch should be properly initialized", async function () {
      const id = await newBatch(Traceability, Values.BATCH_DESCRIPTION);

      const batch = await Traceability.getBatch(id);

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.transactions).to.have.lengthOf(1);
      expect(batch.transactions[0].receiver).to.equal(batchOwner);
      expect(batch.transactions[0].info.owner).to.equal(batchOwner);
      expect(batch.transactions[0].info.documentURI).to.equal("");
    });
  });

  describe("Traceability updates", function () {
    let id: bigint;

    beforeEach(async function () {
      id = await newBatch(Traceability, Values.BATCH_DESCRIPTION);
    });

    it("New update should be registered correctly", async function () {
      await Traceability.handleUpdate(id, Values.UPDATE_DOCUMENT_URI);

      const batch = await Traceability.getBatch(id);
      const updateIdx = batch.updates.length - 1;

      expect(batch.id).to.equal(id);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.updates[updateIdx].owner).to.equal(batchOwner);
      expect(batch.updates[updateIdx].documentURI).to.equal(
        Values.UPDATE_DOCUMENT_URI
      );
    });

    xit("New update with owner address different than tx sender", async function () {
      // Skipped
      // const update: Traceability.UpdateStruct = {
      //   owner: actor2.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.add(1),
      // };
      // await expect(
      //   Traceability.handleUpdate(id, update)
      // ).to.be.revertedWith("Update owner differs from message sender");
    });

    xit("New update with invalid timestamp, lower than previous update", async function () {
      // Skipped
      // const update: Traceability.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.sub(1),
      // };
      // await expect(
      //   Traceability.handleUpdate(id, update)
      // ).to.be.revertedWith("Invalid update timestamp");
    });

    xit("New update with invalid timestamp, higher than block ts", async function () {
      // Skiped
      // const update: Traceability.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.add(9999),
      // };
      // await expect(Traceability.handleUpdate(id, update)).to.be.revertedWith(
      //   "Invalid update timestamp"
      // );
    });

    xit("New update with invalid timestamp, lower than batch genesis", async function () {
      // const update: Traceability.UpdateStruct = {
      //   owner: owner.address,
      //   documentURI: Values.UPDATE_DOCUMENT_URI,
      //   ts: batchTs.sub(9999),
      // };
      // await expect(Traceability.handleUpdate(id, update)).to.be.revertedWith(
      //   "Invalid update timestamp"
      // );
    });

    it("New update from actor that is not the current owner", async function () {
      // Change sender to normal actor
      Traceability = Traceability.connect(await ethers.getSigner(actor1));

      await expect(
        Traceability.handleUpdate(id, Values.UPDATE_DOCUMENT_URI)
      ).to.be.revertedWithCustomError(
        Traceability,
        "UserIsNotCurrentBatchOwner"
      );
    });
  });

  describe("Traceability transactions", function () {
    let id: bigint;

    beforeEach(async function () {
      id = await newBatch(Traceability, Values.BATCH_DESCRIPTION);
    });

    it("New transaction between actors works correctly", async function () {
      await Traceability.handleTransaction(
        id,
        actor1,
        Values.UPDATE_DOCUMENT_URI
      );

      const batch = await Traceability.getBatch(id);
      const transactionIdx = batch.transactions.length - 1;

      expect(batch.id).to.equal(id);
      expect(batch.currentOwner).to.equal(actor1);
      expect(batch.description).to.equal(Values.BATCH_DESCRIPTION);
      expect(batch.transactions[transactionIdx].receiver).to.equal(actor1);
      expect(batch.transactions[transactionIdx].info.owner).to.equal(
        batchOwner
      );
    });

    it("New transaction from actor that is not the current owner", async function () {
      // Change sender to normal actor
      Traceability = Traceability.connect(await ethers.getSigner(actor1));

      await expect(
        Traceability.handleTransaction(id, actor2, Values.UPDATE_DOCUMENT_URI)
      ).to.be.revertedWithCustomError(
        Traceability,
        "UserIsNotCurrentBatchOwner"
      );
    });
  });
});
