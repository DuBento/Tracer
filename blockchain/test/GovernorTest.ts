import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  GovernorContract,
  GovernorTimelock,
  GovernorToken,
  Supplychain,
  SupplychainFactory,
  Supplychain__factory,
} from "../artifacts-frontend/typechain";
import { execute } from "../lib/execute";
import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";
import { propose } from "../lib/propose";
import * as utils from "../lib/utils";
import { vote } from "../lib/vote";
import { createNewBatch } from "./SupplyChainTest";
import {
  BATCH_DESCRIPTION,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_VOTE_DESCRIPTION,
} from "./TestConfig";

describe("Governor", function () {
  let governorContract: GovernorContract;
  let governorToken: GovernorToken;
  let governorTimelock: GovernorTimelock;
  let supplychainFactory: SupplychainFactory;

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
  });

  it("Succesfully deploys and Timelock is the correct owner", async function () {
    // used to show gas report for deplpoyment
    expect(await supplychainFactory.owner()).to.equal(
      await governorTimelock.getAddress()
    );
  });

  describe("Supplychain factory", function () {
    let supplychain: Supplychain;

    // async function newSupplychainThroughGovernorFixture() {
    //   const { proposalId, contractAddress } =
    //     await newSupplychainContractViaGovernance();
    //   return { proposalId, contractAddress };
    // }

    beforeEach(async function () {
      const { contractAddress } = await newSupplychainContractViaGovernance();
      const { deployer } = await getNamedAccounts();
      console.log("deployer address :", deployer);

      supplychain = Supplychain__factory.connect(
        contractAddress,
        await ethers.getSigner(deployer)
      );
    });

    it("Propose, vote and execute a new supplychain contract", async function () {
      console.log("Timelock address:", await governorTimelock.getAddress());
      console.log(
        "SupplychainFactory address:",
        await supplychainFactory.getAddress()
      );
      expect(await supplychain.owner()).to.equal(
        await governorTimelock.getAddress()
      );
    });

    it("Interact with onlyOwner functions of the new supplychain contract (via governace)", async function () {
      const batchId = await createNewBatch(supplychain, BATCH_DESCRIPTION);

      const nextState =
        await supplychain.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED();

      const encodedFunctionCall = await utils.encodeFunctionCall(
        "Supplychain",
        "changeConformityState",
        [batchId.toString(), nextState.toString()]
      );

      const proposalId = await propose(
        await supplychain.getAddress(),
        encodedFunctionCall,
        PROPOSAL_DESCRIPTION
      );

      const proposalState = await vote(
        proposalId.toString(),
        1 /* For */,
        PROPOSAL_VOTE_DESCRIPTION
      );

      await execute(
        await supplychain.getAddress(),
        encodedFunctionCall,
        PROPOSAL_DESCRIPTION
      );

      expect((await supplychain.getBatch(batchId)).state).to.equal(nextState);
    });
  });
});
