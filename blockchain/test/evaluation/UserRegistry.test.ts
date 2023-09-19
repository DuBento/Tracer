import { expect } from "chai";
import { ethers, getNamedAccounts } from "hardhat";
import {
  UserRegistry,
  UserRegistry__factory,
} from "../../artifacts-frontend/typechain";
import {
  EVALUATION_32_STRING,
  MEMBER_VOTING_POWER,
  UPDATE_DOCUMENT_URI,
} from "../TestConfig";

/* We deploy a new instance of the UserRegistry to be able to test the methods directly without going through the governance process */
describe("UserRegistry evaluation", function () {
  var deployer: string;
  var supplychainManager: string;
  var actor1: string;
  var userRegistry: UserRegistry;

  before(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    supplychainManager = namedAccounts.supplychainManager;
    actor1 = namedAccounts.actor1;

    userRegistry = await new UserRegistry__factory(
      await ethers.getSigner(deployer)
    ).deploy();
    userRegistry = await userRegistry.waitForDeployment();
  });

  it("New member", async () => {
    const tx = await userRegistry.addMember(
      supplychainManager,
      EVALUATION_32_STRING,
      UPDATE_DOCUMENT_URI,
      MEMBER_VOTING_POWER
    );
    await tx.wait();

    const member = await userRegistry.getMember(supplychainManager);
    expect(member.addr).equal(supplychainManager);
  });

  it("New actor", async () => {
    const tx = await userRegistry.addActor(
      actor1,
      EVALUATION_32_STRING,
      UPDATE_DOCUMENT_URI
    );
    await tx.wait();

    const actor = await userRegistry.getActor(actor1);
    expect(actor.addr).equal(actor1);
  });

  it("Update member", async () => {
    const tx = await userRegistry["updateMember(address,string,string)"](
      supplychainManager,
      EVALUATION_32_STRING.replace(/^./, "~"),
      UPDATE_DOCUMENT_URI
    );
    await tx.wait();

    const member = await userRegistry.getMember(supplychainManager);
    expect(member.name).equal(EVALUATION_32_STRING.replace(/^./, "~"));
  });

  it("Update actor", async () => {
    const userRegistryAsActor1 = userRegistry.connect(
      await ethers.getSigner(actor1)
    );
    const tx = await userRegistryAsActor1.updateActor(
      actor1,
      EVALUATION_32_STRING.replace(/^./, "~"),
      UPDATE_DOCUMENT_URI
    );
    await tx.wait();

    const actor = await userRegistry.getActor(actor1);
    expect(actor.name).equal(EVALUATION_32_STRING.replace(/^./, "~"));
  });

  it("Add contract to actor access control list", async () => {
    const fakeContractAddress = ethers.Wallet.createRandom().address;
    const tx = await userRegistry.addContractToActor(
      fakeContractAddress,
      actor1
    );
    await tx.wait();

    const actor = await userRegistry.getActor(actor1);
    expect(actor.participatingContracts).to.include(fakeContractAddress);
    expect(await userRegistry.checkAccess(fakeContractAddress, actor1)).to.be
      .true;
  });

  it("Update actor state", async () => {
    const tx = await userRegistry.updateActorState(
      actor1,
      await userRegistry.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED()
    );
    await tx.wait();

    const actor = await userRegistry.getActor(actor1);
    expect(actor.state).equal(
      await userRegistry.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED()
    );
  });
});
