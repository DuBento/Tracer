// Constants
export const BATCH_DESCRIPTION = "Batch test description";
export const UPDATE_DOCUMENT_URI = "<test update uri>";
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
