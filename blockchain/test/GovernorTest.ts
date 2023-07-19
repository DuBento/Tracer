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
import {
  USER_REGISTRY_UPDATE_MEMBER_DESCRIPTION,
  USER_REGISTRY_UPDATE_MEMBER_STATE_METHOD,
} from "../properties";
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

    console.log(`#####
    GovernorContract: ${await governorContract.getAddress()}
    GovernorToken: ${await governorToken.getAddress()}
    GovernorTimelock: ${await governorTimelock.getAddress()}
    SupplychainFactory: ${await supplychainFactory.getAddress()}
    UserRegistry: ${await userRegistry.getAddress()}
    #####`);
  });

  it("Succesfully deploys and Timelock is the correct owner", async function () {
    // used to show gas report for deplpoyment
    expect(await supplychainFactory.owner()).to.equal(
      await governorTimelock.getAddress()
    );
  });

  describe("User Registry", function () {
    it("Add member succesfully", async function () {
      const { supplychainManager } = await getNamedAccounts();
      const { member } = await newMemberViaGovernance(supplychainManager);
      expect(member.addr).to.equal(supplychainManager);
    });

    it("Add actor succesfully, with unregistered no privilege account", async function () {
      const { actor1 } = await getNamedAccounts();
      const userRegistryAsActor1 = userRegistry.connect(
        await ethers.getSigner(actor1)
      );
      await userRegistryAsActor1.addActor(actor1, ACTOR_NAME, ACTOR_INFO_URI);

      const resActor = await userRegistry.actors(actor1);
      expect(resActor.addr).to.equal(actor1);
      expect(resActor.name).to.equal(ACTOR_NAME);
      expect(resActor.infoURI).to.equal(ACTOR_INFO_URI);
      expect(resActor.state).to.equal(
        await userRegistry.CONFORMITY_STATE_FUNCTIONING()
      );
    });

    xit("Add supplychain contract to actor", async function () {
      // TODO: not trival due to contract ownership
    });

    it("Update actor with different account, unsuccesfully", async function () {
      const { actor1 } = await getNamedAccounts();
      const userRegistryAsActor1 = userRegistry.connect(
        await ethers.getSigner(actor1)
      );
      await userRegistryAsActor1.addActor(actor1, ACTOR_NAME, ACTOR_INFO_URI);

      const { actor2 } = await getNamedAccounts();
      const userRegistryAsActor2 = userRegistry.connect(
        await ethers.getSigner(actor2)
      );
      await expect(
        userRegistryAsActor2.updateActor(actor1, ACTOR_NAME, ACTOR_INFO_URI)
      ).to.be.revertedWithCustomError(
        userRegistry,
        "TransactionNotFromOriginalActorAddress"
      );
    });
  });

  describe("Proposals", function () {
    const encodeFunctionCall = async (addr: string, state: string) =>
      await utils.encodeFunctionCall(
        "UserRegistry",
        USER_REGISTRY_UPDATE_MEMBER_STATE_METHOD,
        [addr, state]
      );

    it("Vote proposal with new member succesfully", async function () {
      const { actor1 } = await getNamedAccounts();
      await newMemberViaGovernance(actor1);

      const newState =
        await userRegistry.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED();
      const encodedCall = await encodeFunctionCall(actor1, newState.toString());

      const proposalId = await propose(
        await utils.getContractAddress("UserRegistry"),
        encodedCall,
        USER_REGISTRY_UPDATE_MEMBER_DESCRIPTION
      );

      let state = await vote(
        proposalId.toString(),
        1,
        PROPOSAL_VOTE_DESCRIPTION,
        actor1
      );

      expect(state).to.equal(4); // 4 = Succeeded
    });

    it("Propose with registered actor succesfully", async function () {});
    it("Propose with unregistered actor, unsuccesfully", async function () {});
    it("Vote with actor, unsuccesfully", async function () {});
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
