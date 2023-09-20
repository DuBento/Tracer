import { deployments, getNamedAccounts } from "hardhat";
import {
  Traceability,
  TraceabilityContractFactory,
  UserRegistry,
} from "../../artifacts-frontend/typechain";
import { utils } from "../../lib";
import { SUPPLYCHAIN_CONTRACT_DESCRIPTION } from "../../properties";
import * as Values from "../TestConfig";

export async function deploySupplychainFixture() {
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
    SUPPLYCHAIN_CONTRACT_DESCRIPTION,
    Values.TRANSACTION_REQUIRED_ATTRIBUTE_KEYS
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
