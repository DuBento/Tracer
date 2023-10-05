/**
 * Workload to evaluate real system use.
 * Assume Governance with important members already registered. In our test, there is one dev member with enough voting power to pass proposals.
 * 1. Register new regional member via Governance [propose, vote and execute]
 * 2. Create new Traceability contract for the new member via Governance [propose, vote and execute]
 * 3. Add 3 actors to the user registry
 * 4. Add actors to the traceability contract
 * 5. One of the actors creates a new batch
 * 6. Each actor pushes one update and one transaction; All payloads are the same, only changing the address
 **/

import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  GovernorContract,
  Traceability,
  UserRegistry,
} from "../../../artifacts-frontend/typechain";
import {
  execute,
  newBatch,
  newMemberViaGovernance,
  newSupplychainContractViaGovernance,
  propose,
  utils,
  vote,
} from "../../../lib";
import {
  ACTOR_INFO_URI,
  ACTOR_NAME,
  BATCH_DESCRIPTION,
  EVALUATION_URI,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_VOTE_DESCRIPTION,
} from "../../TestConfig";

describe("Workload 1", function () {
  const N_UPDATES = 1;

  var supplychainManager: string;
  var actor1: string;
  var actor2: string;
  var actor3: string;

  var governorContract: GovernorContract;
  var userRegistry: UserRegistry;
  var traceabilityContractAddress: string;
  var batchId: string;

  var totalGasUsed = 0;

  before(async function () {
    await deployments.fixture(["dao"]);
    const namedAccounts = await getNamedAccounts();
    supplychainManager = namedAccounts.supplychainManager;
    actor1 = namedAccounts.actor1;
    actor2 = namedAccounts.actor2;
    actor3 = namedAccounts.actor3;

    governorContract = await utils.getContract<GovernorContract>(
      "GovernorContract"
    );
    userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  });

  it("Register new regional member via Governance [propose, vote and execute]", async () => {
    const { member, gasUsed } = await newMemberViaGovernance(
      supplychainManager
    );

    expect(member.addr).to.equal(supplychainManager);

    totalGasUsed += Number(gasUsed);
    console.log(
      `Gas used registering a new member via governance [propose, vote and execute]: ${gasUsed} = ${gasUsed} (propose) + ${gasUsed} (vote) + ${gasUsed} (execute)`
    );
  });

  it("Create new Traceability contract for the new member via Governance [propose, vote and execute]", async () => {
    const {
      contractAddress,
      gasUsed,
      gasUsedExecute,
      gasUsedPropose,
      gasUsedVote,
    } = await newSupplychainContractViaGovernance(supplychainManager);

    traceabilityContractAddress = contractAddress;
    totalGasUsed += Number(gasUsed);
    console.log(
      `Gas used creating a new traceability contract via governance [propose, vote and execute]: ${gasUsed} = ${gasUsedPropose} (propose) + ${gasUsedVote} (vote) + ${gasUsedExecute} (execute)`
    );
  });

  it("Add actors to the user registry", async () => {
    let gasUsedArray: number[] = [];
    for (const actor of [actor1, actor2, actor3]) {
      const tx = await userRegistry.addActor(actor, ACTOR_NAME, ACTOR_INFO_URI);
      const receipt = await tx.wait();
      if (!receipt) throw new Error("No receipt");

      const resActor = await userRegistry.getActor(actor);
      expect(resActor.addr).to.equal(actor);

      const gasUsed = receipt.gasUsed;
      gasUsedArray.push(Number(gasUsed));
    }

    const gasUsedSum = gasUsedArray.reduce((a, b) => a + b, 0);

    totalGasUsed += gasUsedSum;
    console.log(
      `Gas used adding actors to the user registry: ${gasUsedSum} = ${gasUsedArray
        .map((gas) => `${gas}`)
        .join(" + ")} (each actor)`
    );
  });

  it("Add traceability contract to actors access control list", async () => {
    const userRegistryAsSupplychainManager = userRegistry.connect(
      await ethers.getSigner(supplychainManager)
    );

    let gasUsedArray: number[] = [];
    for (const actor of [actor1, actor2, actor3]) {
      const tx = await userRegistryAsSupplychainManager.addContractToActor(
        traceabilityContractAddress,
        actor
      );
      const receipt = await tx.wait();
      if (!receipt) throw new Error("No receipt");

      const hasAccess = await userRegistry.checkAccess(
        traceabilityContractAddress,
        actor
      );
      expect(hasAccess).to.be.true;

      const gasUsed = receipt.gasUsed;
      gasUsedArray.push(Number(gasUsed));
    }

    const gasUsedSum = gasUsedArray.reduce((a, b) => a + b, 0);

    totalGasUsed += gasUsedSum;
    console.log(
      `Gas used adding traceability contract to actor access control list: ${gasUsedSum} = ${gasUsedArray
        .map((gas) => `${gas}`)
        .join(" + ")} (each actor)`
    );
  });

  it("Actor1 creates a new batch", async () => {
    const traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      {
        contractAddress: traceabilityContractAddress,
        signerAddress: actor1,
      }
    );

    const { batchId: newBatchId, gasUsed } = await newBatch(
      traceabilityContract,
      BATCH_DESCRIPTION,
      EVALUATION_URI
    );

    expect(newBatchId).to.not.equal(0);

    batchId = newBatchId.toString();
    totalGasUsed += Number(gasUsed);

    console.log(`Gas used creating a new batch: ${gasUsed}`);
  });

  it(`Each actor pushes ${N_UPDATES} update and one transaction`, async () => {
    let traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      { contractAddress: traceabilityContractAddress }
    );

    const actors = [actor1, actor2, actor3];

    let gasUsedArrayUpdate: number[] = [];
    let gasUsedArrayTransaction: number[] = [];
    for (let i = 0; i < actors.length; i++) {
      traceabilityContract = traceabilityContract.connect(
        await ethers.getSigner(actors[i])
      );

      // update
      for (let j = 0; j < N_UPDATES; j++) {
        const tx = await traceabilityContract.handleUpdate(
          batchId,
          EVALUATION_URI
        );
        const receipt = await tx.wait();
        if (!receipt) throw new Error("No receipt");
        gasUsedArrayUpdate.push(Number(receipt.gasUsed));
      }

      // transaction
      if (i + 1 >= actors.length) break; // no transaction for last actor
      const tx2 = await traceabilityContract.handleTransaction(
        batchId,
        actors[i + 1],
        EVALUATION_URI,
        []
      );
      const receipt2 = await tx2.wait();
      if (!receipt2) throw new Error("No receipt");
      gasUsedArrayTransaction.push(Number(receipt2.gasUsed));
    }

    const gasUsedUpdate = gasUsedArrayUpdate.reduce((a, b) => a + b, 0);
    const gasUsedTransaction = gasUsedArrayTransaction.reduce(
      (a, b) => a + b,
      0
    );
    const gasUsedBoth = gasUsedUpdate + gasUsedTransaction;

    totalGasUsed += gasUsedBoth;
    console.log(
      `Gas used pushing one update and one transaction: ${gasUsedBoth} = ${gasUsedUpdate} (update [${gasUsedArrayUpdate
        .map((gas) => gas.toString())
        .join(
          " + "
        )}]) + ${gasUsedTransaction} (transaction [${gasUsedArrayTransaction
        .map((gas) => gas.toString())
        .join(" + ")}])`
    );
  });

  it("Supplychain manager flags the batch via governance", async () => {
    const traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      {
        contractAddress: traceabilityContractAddress,
        signerAddress: supplychainManager,
      }
    );
    const nextState =
      await traceabilityContract.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED();

    const encodedFunctionCall = await utils.encodeFunctionCall(
      "Traceability",
      "changeConformityState",
      [batchId.toString(), nextState.toString()]
    );

    const { proposalId, gasUsed: gasUsedPropose } = await propose(
      traceabilityContractAddress,
      encodedFunctionCall,
      PROPOSAL_DESCRIPTION
    );

    const { gasUsed: gasUsedVote } = await vote(
      proposalId.toString(),
      1 /* For */,
      PROPOSAL_VOTE_DESCRIPTION
    );

    const { gasUsed: gasUsedExecute } = await execute(
      traceabilityContractAddress,
      encodedFunctionCall,
      PROPOSAL_DESCRIPTION
    );

    expect((await traceabilityContract.getBatch(batchId)).state).to.equal(
      nextState
    );

    console.log(
      `Gas used flagging the batch via governance: ${
        gasUsedPropose + gasUsedVote + gasUsedExecute
      } = ${gasUsedPropose} (propose) + ${gasUsedVote} (vote) + ${gasUsedExecute} (execute)`
    );

    totalGasUsed +=
      Number(gasUsedPropose) + Number(gasUsedVote) + Number(gasUsedExecute);
  });

  after(function () {
    console.log(`Total gas used: ${totalGasUsed}`);
  });
});
