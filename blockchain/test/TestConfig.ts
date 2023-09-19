// Constants
export const EVALUATION_32_CHAR_STRING = "Evaluation string with 32 chars.";
export const BATCH_DESCRIPTION = "Batch description with 31 chars";
export const UPDATE_DOCUMENT_URI =
  "QmNuse4iX7n9NFzXfA7pGNig8TGoWDytXjPwaSZi3uPPmf";
export const TRANSACTION_REQUIRED_ATTRIBUTE_KEYS: string[] = [];
export const TRANSACTION_REQUIRED_ATTRIBUTE_VALUES: string[] = [];

export const PROPOSAL_DESCRIPTION = "Proposal test description";
export const PROPOSAL_VOTE_FOR = 1;
export const PROPOSAL_VOTE_DESCRIPTION = "Vote for test proposal";

export const MEMBER_NAME = "Regional Member";
export const MEMBER_INFO_URI = "<member test uri>";
// bigger than quorum and less than max voting power. For development, able to pass proposals with only one member
export const MEMBER_VOTING_POWER = 49;

export const ACTOR_NAME = "Test actor";
export const ACTOR_INFO_URI = "<actor test uri>";

export const tsNow = () => BigInt(Math.floor(Date.now() / 1000));
