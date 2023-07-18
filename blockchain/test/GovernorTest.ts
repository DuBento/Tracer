import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  GovernorContract,
  GovernorTimelock,
  GovernorToken,
  Supplychain,
  SupplychainFactory,
  Supplychain__factory,
  UserRegistry,
} from "../artifacts-frontend/typechain";
import { execute } from "../lib/execute";
import { newMemberViaGovernance } from "../lib/newMemberViaGovernance";
import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";
import { propose } from "../lib/propose";
import * as utils from "../lib/utils";
import { vote } from "../lib/vote";
import { createNewBatch } from "./SupplyChainTest";
import {
  ACTOR_INFO_URI,
  ACTOR_NAME,
  BATCH_DESCRIPTION,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_VOTE_DESCRIPTION,
} from "./TestConfig";

describe("Governor", function () {
  let governorContract: GovernorContract;
  let governorToken: GovernorToken;
  let governorTimelock: GovernorTimelock;
  let supplychainFactory: SupplychainFactory;
  let userRegistry: UserRegistry;

  beforeEach(async function () {
    await deployments.fixture("dao");
    governorContract = await utils.getContract<GovernorContract>(
      "GovernorContract"
    );
    governorToken = await utils.getContract<GovernorToken>("GovernorToken");
    governorTimelock = await utils.getContract<GovernorTimelock>(
      "GovernorTimelock"
    );
    supplychainFactory = await utils.getContract<SupplychainFactory>(
      "SupplychainFactory"
    );
    userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  });

  it("Succesfully deploys and Timelock is the correct owner", async function () {
    // used to show gas report for deplpoyment
    expect(await supplychainFactory.owner()).to.equal(
      await governorTimelock.getAddress()
    );
  });

  describe("Supplychain factory", function () {
    let supplychainContractAddress: string;
    let supplychainContractAsManager: Supplychain;
    let supplychainContractAsActor1: Supplychain;
    let supplychainManager: string;
    let actor1: string;

    // async function newSupplychainThroughGovernorFixture() {
    //   const { proposalId, contractAddress } =
    //     await newSupplychainContractViaGovernance();
    //   return { proposalId, contractAddress };
    // }

    // async function setupUserRegisterFixture() {
    //   const { supplychainManager } = await getNamedAccounts();
    //   const { member } = await newMemberViaGovernance(supplychainManager);

    //   await userRegistry.addActor(actor1, ACTOR_NAME, ACTOR_INFO_URI);

    //   return { member };
    // }

    beforeEach(async function () {
      const accounts = await getNamedAccounts();
      supplychainManager = accounts.supplychainManager;
      actor1 = accounts.actor1;

      const { member } = await newMemberViaGovernance(supplychainManager);

      await userRegistry.addActor(actor1, ACTOR_NAME, ACTOR_INFO_URI);

      console.log(
        `### Address of supplychainManager: ${supplychainManager}
        ###UserReg member: ${await userRegistry.members(supplychainManager)}`
      );
      const { contractAddress, proposalId } =
        await newSupplychainContractViaGovernance(supplychainManager);
      supplychainContractAddress = contractAddress;

      console.log(`###User Registry addContract to actor...`);
      await userRegistry
        .connect(await ethers.getSigner(supplychainManager))
        .addContractToActor(contractAddress, actor1);

      console.log(`###User Registry ${await userRegistry.actors(actor1)}`);
      const { deployer } = await getNamedAccounts();
      console.log("deployer address :", deployer);

      supplychainContractAsManager = Supplychain__factory.connect(
        contractAddress,
        await ethers.getSigner(supplychainManager)
      );
      supplychainContractAsActor1 = Supplychain__factory.connect(
        contractAddress,
        await ethers.getSigner(actor1)
      );
    });

    it("Propose, vote and execute a new supplychain contract", async function () {
      console.log("Timelock address:", await governorTimelock.getAddress());
      console.log(
        "SupplychainFactory address:",
        await supplychainFactory.getAddress()
      );
      expect(await supplychainContractAsManager.owner()).to.equal(
        await governorTimelock.getAddress()
      );
    });

    it("Interact with onlyOwner functions of the new supplychain contract (via governace)", async function () {
      const batchId = await createNewBatch(
        supplychainContractAsActor1,
        BATCH_DESCRIPTION
      );

      const nextState =
        await supplychainContractAsManager.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED();

      const encodedFunctionCall = await utils.encodeFunctionCall(
        "Supplychain",
        "changeConformityState",
        [batchId.toString(), nextState.toString()]
      );

      const proposalId = await propose(
        supplychainContractAddress,
        encodedFunctionCall,
        PROPOSAL_DESCRIPTION
      );

      const proposalState = await vote(
        proposalId.toString(),
        1 /* For */,
        PROPOSAL_VOTE_DESCRIPTION
      );

      await execute(
        supplychainContractAddress,
        encodedFunctionCall,
        PROPOSAL_DESCRIPTION
      );

      expect(
        (await supplychainContractAsManager.getBatch(batchId)).state
      ).to.equal(nextState);
    });
  });
});
