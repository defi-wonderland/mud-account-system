import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ActionEnv } from "../sections";
import AuthControllerABI from "../abi/AuthController.sol/AuthController.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {
  const permissions: any = {};

  const getPermissionData = async (actionEnv: ActionEnv, limitData: any) => {
    return {
      authController: await worldContract.getAuthController(),
      client: (await actionEnv.accountSystem.getBurnerWalletProvider()).address,
      world: worldContract.address,
      limitChecker: await worldContract.getAccountSystemAddress(),
      limitData: limitData,
    };
  };

  const getSignature = async (actionEnv: ActionEnv, permissionData: any) => {
    return await actionEnv.provider.signer?.signMessage(
      JSON.stringify(permissionData)
    );
  };

  const createGamePermissions = async (
    actionEnv: ActionEnv,
    firstAddress: string,
    secondAddress: string
  ) => {
    const populatedTransaction =
      await worldContract.populateTransaction.createGame(
        firstAddress,
        secondAddress
      );

    const limitData = await worldContract.callStatic.getLimitData(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      populatedTransaction.data!
    );

    const permissionData = await getPermissionData(actionEnv, limitData);
    console.log("permision", permissionData);
    const signature = await getSignature(actionEnv, permissionData);
    const accountContract = await actionEnv.accountSystem.getAccountContract(
      actionEnv
    );
    const permissionId = accountContract.callStatic.auth(
      permissionData,
      signature
    );
    const receipt = await accountContract.auth(permissionData, signature);
    console.log(receipt);
    // TODO CHECK IF THIS IS OK!
    return permissionId;
  };

  const createAccount = async () => {
    const tx = await worldSend("createAccount", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const createGame = async (
    actionEnv: ActionEnv,
    firstAddress: string,
    secondAddress: string
  ) => {
    const populatedTransaction =
      await worldContract.populateTransaction.createGame(
        firstAddress,
        secondAddress
      );

    if (!permissions["createGame"]) {
      const permissionId = await createGamePermissions(
        actionEnv,
        firstAddress,
        secondAddress
      );
      permissions["createGame"] = permissionId;
    }

    console.log(populatedTransaction);
    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    const tx = await sendThroughAccount(
      permissions["createGame"],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      populatedTransaction.data!
    );
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    delete permissions["createGame"];
    return getComponentValue(CounterGame, singletonEntity);
  };

  const acceptGame = async (actionEnv: ActionEnv, gameId: string) => {
    const txData = await worldContract.populateTransaction.acceptGame(gameId);
    console.log(txData);

    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tx = await sendThroughAccount(
      permissions["acceptGame"],
      txData.data!
    );

    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const increment = async (
    actionEnv: ActionEnv,
    gameId: string,
    message: string
  ) => {
    const txData = await worldContract.populateTransaction.increment(
      gameId,
      message
    );
    const permissionId = "420"; // TODO Get correct permission ID
    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tx = await sendThroughAccount(permissionId, txData.data!);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  return {
    createGame,
    acceptGame,
    createAccount,
    increment,
  };
}
