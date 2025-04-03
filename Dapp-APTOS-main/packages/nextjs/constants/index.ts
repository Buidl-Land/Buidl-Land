export const MODULE_ADDRESS = "0x110c0e6e7192bcc4cb6b4e1dcda49d1366c44f3f0cf17e18e1cec5b93aa0ea79" // Replace with actual deployment address

export const MockCrowdfundingModule = {
  MODULE_NAME: "mock_crowfunding",
  FUNCTIONS: {
    // Core functions
    CONTRIBUTE_FUNDING: "contribute_funding",
    DEPOSIT_FUNDING: "deposit_funding",
    CREATE_TASK: "create_task",
    ASSIGN_TASK: "assign_task",
    START_TASK: "start_task",

    // View functions
    GET_TASK_STATE: "get_task_state",
    GET_CROWD_FUNDING: "get_crowd_funding"
  },
  EVENTS: {
    TASK_CREATED: "TaskCreatedEvent",
    TASK_ASSIGNED: "TaskAssignedEvent",
    TASK_STARTED: "TaskStartedEvent"
  },
  STRUCT: {
    CROWD_FUNDING: "CrowdFunding",
    TASK: "Task"
  }
} as const;

export const TaskStatus = {
  OPEN: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2
} as const;

export const Errors = {
  TASK_NOT_ASSIGNED: 0
} as const;

export const CoinType = {
  // Example format - replace with actual coin types used
  APTOS: "0x1::aptos_coin::AptosCoin",
  USDC: "0x110c0e6e7192bcc4cb6b4e1dcda49d1366c44f3f0cf17e18e1cec5b93aa0ea79::test_usdc::FaucetCoin"
} as const;