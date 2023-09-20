import { IUserRegistry, UserRegistry } from "../artifacts-frontend/typechain";
import {
  USER_REGISTRY_ADD_MEMBER_DESCRIPTION,
  USER_REGISTRY_ADD_MEMBER_METHOD,
} from "../properties";
import {
  EVALUATION_32_CHAR_STRING,
  MEMBER_INFO_URI,
  MEMBER_NAME,
  MEMBER_VOTING_POWER,
} from "../test/TestConfig";
import { execute } from "./execute";
import { propose } from "./propose";
import * as utils from "./utils";
import { vote } from "./vote";

const getEncodedFunctionCall = async (addr: string) =>
  await utils.encodeFunctionCall(
    "UserRegistry",
    USER_REGISTRY_ADD_MEMBER_METHOD,
    [addr, MEMBER_NAME, MEMBER_INFO_URI, MEMBER_VOTING_POWER.toString()]
  );

export async function proposeNewMember(
  memberAddress: string,
  signerAddress?: string
) {
  const encodedFunctionCall = await getEncodedFunctionCall(memberAddress);

  return await propose(
    await utils.getContractAddress("UserRegistry"),
    encodedFunctionCall,
    USER_REGISTRY_ADD_MEMBER_DESCRIPTION,
    signerAddress
  );
}

async function voteFor(proposalId: string) {
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = EVALUATION_32_CHAR_STRING;
  return await vote(proposalId, decision, reason);
}

export async function executeNewMemberProposal(memberAddress: string) {
  const encodedFunctionCall = await getEncodedFunctionCall(memberAddress);

  return await execute(
    await utils.getContractAddress("UserRegistry"),
    encodedFunctionCall,
    USER_REGISTRY_ADD_MEMBER_DESCRIPTION
  );
}

async function getMember(
  memberAddress: string
): Promise<IUserRegistry.MemberStructOutput> {
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const member = await userRegistry.getMember(memberAddress);
  return member;
}

export async function newMemberViaGovernance(memberAddress: string) {
  let member = await getMember(memberAddress);
  if (member.addr == memberAddress) {
    console.log(`${memberAddress} already member, skipping...`);
    return { member, proposalId: null };
  }

  const { proposalId, gasUsed: gasUsedPropose } = await proposeNewMember(
    memberAddress
  );

  const { gasUsed: gasUsedVote } = await voteFor(proposalId.toString());

  const { gasUsed: gasUsedExecute } = await executeNewMemberProposal(
    memberAddress
  );
  // console.log(`Member added: ${memberAddress}`);
  member = await getMember(memberAddress);

  return {
    member,
    proposalId,
    gasUsed: gasUsedPropose + gasUsedPropose + gasUsedExecute,
    gasUsedPropose,
    gasUsedVote,
    gasUsedExecute,
  };
}
