import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  GovernorContract,
  UserRegistry__factory,
} from "../../../artifacts-frontend/typechain";
import { proposeNewMember, utils, vote } from "../../../lib";
import { executeNewMemberProposal } from "../../../lib/newMemberViaGovernance";
import {
  MEMBER_INFO_URI,
  MEMBER_NAME,
  MEMBER_VOTING_POWER,
  PROPOSAL_VOTE_DESCRIPTION,
} from "../../TestConfig";

describe("Governor evaluation", function () {
  var deployer: string;
  var supplychainManager: string;
  var actor1: string;
  var governorContract: GovernorContract;
  var proposalId: string;

  before(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    supplychainManager = namedAccounts.supplychainManager;
    actor1 = namedAccounts.actor1;

    await deployments.fixture(["dao"]);
    governorContract = await utils.getContract<GovernorContract>(
      "GovernorContract"
    );
  });

  it("Propose new member from unregistered account", async () => {
    const { proposalId: newMemberProposalId, gasUsed } = await proposeNewMember(
      actor1
    );

    const proposalState = await governorContract.state(newMemberProposalId);
    expect(proposalState).to.equal(0); // 0 = Active

    proposalId = newMemberProposalId.toString();
    console.log(`Gas used: ${gasUsed}`);
  });

  it("Vote proposal", async () => {
    const { proposalState, gasUsed } = await vote(
      proposalId,
      1,
      PROPOSAL_VOTE_DESCRIPTION
    );

    expect(proposalState).to.equal(3); // 3 = Succeeded
    console.log(`Gas used: ${gasUsed}`);
  });

  it("Execute proposal", async () => {
    const { proposalId: executeProposalId, gasUsed } =
      await executeNewMemberProposal(actor1);
    expect(executeProposalId).to.equal(proposalId);

    const proposalState = await governorContract.state(proposalId);
    expect(proposalState).to.equal(5); // 5 = Executed

    let fakeUserRegistry = await new UserRegistry__factory(
      await ethers.getSigner(deployer)
    ).deploy();
    fakeUserRegistry = await fakeUserRegistry.waitForDeployment();

    const addMemberGasUsed = await fakeUserRegistry.addMember.estimateGas(
      actor1,
      MEMBER_NAME,
      MEMBER_INFO_URI,
      MEMBER_VOTING_POWER.toString()
    );

    console.log(
      `Gas used for the execute method only: ${
        gasUsed - addMemberGasUsed
      } = ${gasUsed} (full execute call) - ${addMemberGasUsed} (add member call)`
    );
  });
});
