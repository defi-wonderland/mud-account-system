import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {

  const createGame = async (sendAsAccount: any, firstAddress: string, secondAddress: string) => {

    const populatedTransaction = await worldContract.populateTransaction.createGame(firstAddress, secondAddress);
    const permissionId = '1'; // TODO Get correct permission ID
    const tx = await sendAsAccount(permissionId, populatedTransaction?.data);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const acceptGame = async (gameId: string) => {

    const txData = await worldContract.populateTransaction.acceptGame(gameId);
    console.log(txData);

    const tx = await worldSend("acceptGame", [gameId]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const createAccount = async () => {
    const tx = await worldSend("createAccount", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  return {
    createGame,
    acceptGame,
    createAccount,
  };
}
