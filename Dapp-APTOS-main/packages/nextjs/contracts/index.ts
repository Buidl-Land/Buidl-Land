import { AccountAddress } from "@aptos-labs/ts-sdk";
import { Hex } from "@aptos-labs/ts-sdk";
import { config } from "../lib/aptos";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  MockCrowdfundingModule,
  MODULE_ADDRESS,
  CoinType,
} from "../constants";

const BuidllandTxFunction = () => {
  const aptos = new Aptos(config);
  const { account, signAndSubmitTransaction } = useWallet();

  const depositFunding = async (pay_balance: number) => {
    const transaction = await signAndSubmitTransaction({
        sender: account!.address,
        data: {
          function: `${MODULE_ADDRESS}::${MockCrowdfundingModule.MODULE_NAME}::${MockCrowdfundingModule.FUNCTIONS.DEPOSIT_FUNDING}` as `${string}::${string}::${string}`,
          functionArguments: [pay_balance],
          typeArguments: [CoinType.USDC]
        },
      });
      try {
        await aptos.waitForTransaction({
          transactionHash: transaction.hash,
        });
      } catch (error) {
        console.error(error);
      }
  };

  const assignTask = async (task_id: string) => {
    const transaction = await signAndSubmitTransaction({
      sender: account!.address,
      data: {
        function: `${MODULE_ADDRESS}::${MockCrowdfundingModule.MODULE_NAME}::${MockCrowdfundingModule.FUNCTIONS.ASSIGN_TASK}` as `${string}::${string}::${string}`,
        functionArguments: [task_id],
        typeArguments: [CoinType.USDC]
      },
    });
    try {
        await aptos.waitForTransaction({
          transactionHash: transaction.hash,
        });
      } catch (error) {
        console.error(error);
      };
  };

  const startTask = async (task_id: string) => {
    const transaction = await signAndSubmitTransaction({
      sender: account!.address,
      data: {
        function: `${MODULE_ADDRESS}::${MockCrowdfundingModule.MODULE_NAME}::${MockCrowdfundingModule.FUNCTIONS.START_TASK}` as `${string}::${string}::${string}`,
        functionArguments: [task_id],
        typeArguments: [CoinType.USDC]
      },
    });
    try {
        await aptos.waitForTransaction({
          transactionHash: transaction.hash,
        });
      } catch (error) {
        console.error(error);
      };
  };

  const getTaskState = async (task_id: string): Promise<Number> => {
    const task_state_payload = {
        function: `${MODULE_ADDRESS}::${MockCrowdfundingModule.MODULE_NAME}::${MockCrowdfundingModule.FUNCTIONS.GET_TASK_STATE}` as `${string}::${string}::${string}`,
        functionArguments: [task_id],
    };
    const task_state = await aptos.view({payload: task_state_payload});
    const task_state_data = task_state as unknown as number;

    return task_state_data
    }

    const getCrowdFunding = async (): Promise<Number> => {
        const crowd_funding_payload = {
            function: `${MODULE_ADDRESS}::${MockCrowdfundingModule.MODULE_NAME}::${MockCrowdfundingModule.FUNCTIONS.GET_CROWD_FUNDING}` as `${string}::${string}::${string}`,
        };
        const crowd_funding = await aptos.view({payload: crowd_funding_payload});
        const crowd_funding_data = crowd_funding as unknown as number;

        return crowd_funding_data;
    }
}

