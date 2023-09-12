import path from "path";

export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"];

export const FRONTEND_ARTIFACTS_PATH = "./artifacts-frontend";
export const CONTRACTS_DIR = path.join(__dirname, FRONTEND_ARTIFACTS_PATH);
export const FRONTEND_OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "frontend",
  "TracerAPI",
  "contracts"
);

export const CONTRACT_ADDRESS_FILE = path.join(
  CONTRACTS_DIR,
  "deployedAddresses.json"
);

export const PROPOSALS_FILE = "proposals.json";

// governor contract
export const VOTING_DELAY = 1; // 1 block
export const VOTING_PERIOD = 5; // 5 blocks

export const SUPPLYCHAIN_CREATE_METHOD = "create";
export const SUPPLYCHAIN_CONTRACT_DESCRIPTION = "Sustainable";
export const SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION =
  "Create a new Traceability contract";

export const USER_REGISTRY_ADD_MEMBER_METHOD = "addMember";
export const USER_REGISTRY_ADD_MEMBER_DESCRIPTION =
  "Add a new member to the user registry";

export const USER_REGISTRY_UPDATE_MEMBER_STATE_METHOD = "updateMemberState";
export const USER_REGISTRY_UPDATE_MEMBER_DESCRIPTION =
  "Update a member in the user registry";

export const MEMBER_DEV_NAME = "Dev member";
export const MEMBER_DEV_INFO_URI = "<member dev uri>";
// bigger than quorum and less than max voting power. For development, able to pass proposals with only one member
export const MEMBER_DEV_VOTING_POWER = 49;

// traceability mock
export const TRACEABILITY_MOCK_ADDRESS_NAME = "mockTraceabilityContract";
export const TRACEABILITY_MOCK_BATCH_ID_NAME = "mockBatchId";
export const TRACEABILITY_MOCK_BATCH_DESCRIPTION =
  "Example batch for wine traceability";
