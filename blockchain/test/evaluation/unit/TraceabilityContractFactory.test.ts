import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import {
  TraceabilityContractFactory,
  TraceabilityContractFactory__factory,
  Traceability__factory,
  UserRegistry,
  UserRegistry__factory,
} from "../../../artifacts-frontend/typechain";
import {
  newMemberViaGovernance,
  newSupplychainContractViaGovernance,
} from "../../../lib";
import {
  EVALUATION_32_CHAR_STRING,
  MEMBER_VOTING_POWER,
  TRANSACTION_REQUIRED_ATTRIBUTE_KEYS,
  UPDATE_DOCUMENT_URI,
} from "../../TestConfig";

/* We deploy a new instance of the TraceabilityContractFactory to be able to test the methods directly without going through the governance process */
describe("TraceabilityContractFactory evaluation", function () {
  var deployer: string;
  var supplychainManager: string;
  var actor1: string;
  var userRegistry: UserRegistry;
  var traceabilityContractFactory: TraceabilityContractFactory;

  before(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    supplychainManager = namedAccounts.supplychainManager;
    actor1 = namedAccounts.actor1;

    userRegistry = await new UserRegistry__factory(
      await ethers.getSigner(deployer)
    ).deploy();
    userRegistry = await userRegistry.waitForDeployment();

    traceabilityContractFactory =
      await new TraceabilityContractFactory__factory(
        await ethers.getSigner(deployer)
      ).deploy(await userRegistry.getAddress());
    traceabilityContractFactory =
      await traceabilityContractFactory.waitForDeployment();

    // link userRegistry and traceabilityContractFactory
    let tx = await userRegistry.setTraceabilityContractFactoryAddress(
      await traceabilityContractFactory.getAddress()
    );
    tx.wait();

    // add necessary member
    tx = await userRegistry.addMember(
      supplychainManager,
      EVALUATION_32_CHAR_STRING,
      UPDATE_DOCUMENT_URI,
      MEMBER_VOTING_POWER
    );
    await tx.wait();
  });

  it("Create new contract using the clone factory directly", async () => {
    const tx = await traceabilityContractFactory.create(
      supplychainManager,
      EVALUATION_32_CHAR_STRING,
      TRANSACTION_REQUIRED_ATTRIBUTE_KEYS
    );
    const receipt = await tx.wait();
    if (!receipt) throw new Error("No deployment receipt");
    console.log(`Gas used creating via clone factory: ${receipt.gasUsed}`);

    const address = await userRegistry.getManagingContractAddress(
      supplychainManager
    );

    expect(address).to.not.equal(ethers.ZeroAddress);
  });

  it("Create new contract directly", async () => {
    let traceability = await new Traceability__factory(
      await ethers.getSigner(deployer)
    ).deploy();
    traceability = await traceability.waitForDeployment();

    let tx = traceability.deploymentTransaction();
    if (!tx) throw new Error("No deployment transaction");
    let receipt = await tx.wait();
    if (!receipt) throw new Error("No deployment receipt");
    const deploymentGasUsed = receipt.gasUsed;

    // Necessary init call, to be considered in evaluation comparing the methods
    tx = await traceability["init(address,address,address,string,string[])"](
      await userRegistry.getAddress(),
      supplychainManager,
      supplychainManager,
      EVALUATION_32_CHAR_STRING,
      TRANSACTION_REQUIRED_ATTRIBUTE_KEYS
    );
    await tx.wait();
    receipt = await tx.wait();
    if (!receipt) throw new Error("No deployment receipt");
    const initCallGasUsed = receipt.gasUsed;

    console.log(
      `Gas used creating: ${
        deploymentGasUsed + initCallGasUsed
      } = ${deploymentGasUsed} (deployment) + ${initCallGasUsed} (init call)`
    );
  });

  it("Create new contract via Governance", async () => {
    await deployments.fixture(["dao"]);

    // not considering the gas used for new member, assuming it is already done
    const { member } = await newMemberViaGovernance(supplychainManager);

    const {
      contractAddress,
      gasUsed,
      gasUsedExecute,
      gasUsedPropose,
      gasUsedVote,
    } = await newSupplychainContractViaGovernance(supplychainManager);

    console.log(
      `Created via governance, gas used: ${gasUsed} = ${gasUsedPropose} (propose) + ${gasUsedVote} (vote) + ${gasUsedExecute} (execute)`
    );
  });
});
