import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {
  const createAccount = async () => {
    const tx = await worldSend("createAccount", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const createGame = async (
    sendThroughAccount: any,
    firstAddress: string,
    secondAddress: string
  ) => {
    const populatedTransaction =
      await worldContract.populateTransaction.createGame(
        firstAddress,
        secondAddress
      );
    const permissionId = "420"; // TODO Get correct permission ID
    console.log(populatedTransaction);
    const tx = await sendThroughAccount(
      permissionId,
      populatedTransaction?.data
    );
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const acceptGame = async (sendThroughAccount: any, gameId: string) => {
    const txData = await worldContract.populateTransaction.acceptGame(gameId);
    console.log(txData);

    const permissionId = "420"; // TODO Get correct permission ID
    const tx = await sendThroughAccount(permissionId, txData?.data);

    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const increment = async (
    sendThroughAccount: any,
    gameId: string,
    message: string
  ) => {
    const txData = await worldContract.populateTransaction.increment(
      gameId,
      message
    );
    const permissionId = "420"; // TODO Get correct permission ID
    const tx = await sendThroughAccount(permissionId, txData?.data);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  return {
    createGame,
    acceptGame,
    createAccount,
    increment,
  };
}
