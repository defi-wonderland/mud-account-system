import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {

  const createGame = async (firstAddress: string, secondAddress: string) => {

    const txData = await worldContract.populateTransaction.createGame(firstAddress, secondAddress);
    console.log(txData);
    // TODO use txData to send as account using 

    const tx = await worldSend("createGame", [firstAddress, secondAddress]);
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
