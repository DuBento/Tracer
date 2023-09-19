import { ethers } from "hardhat";
import { GovernorContract } from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";

export async function execute(
  proposalTarget: string,
  encodedCall: string,
  proposalDescription: string
) {
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes(proposalDescription)
  );

  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract"
  );

  // console.log("Executing...");
  const executeTx = await governor.execute(
    [proposalTarget],
    [0],
    [encodedCall],
    descriptionHash
  );
  const receipt = await executeTx.wait();
  if (!receipt) throw new Error("No receipt received");
  const gasUsed = receipt.gasUsed;

  return { gasUsed };
}
