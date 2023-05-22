import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ethers } from "ethers";
import { ActionEnv } from "../sections";

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
  }

  const getSignature = async (actionEnv: ActionEnv, permissionData: any) => {
    // TODO Ardy please fix this
    return await actionEnv.provider.signer?.signMessage(permissionData);
  }

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
    
    console.log("ethers.utils.toUtf8Bytes(populatedTransaction.data!)");
    console.log(populatedTransaction.data!);
    console.log(ethers.utils.toUtf8Bytes(populatedTransaction.data!));

    const limitData =
      await worldContract.callStatic.getLimitData(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ethers.utils.toUtf8Bytes(populatedTransaction.data!)
    );
    
    const permissionData = await getPermissionData(actionEnv, limitData);
    const signature = await getSignature(actionEnv, permissionData);
    const accountContract = await actionEnv.accountSystem.getAccountContract(actionEnv);
    const permissionId = accountContract.callStatic.auth(permissionData, signature);
    const receipt = await accountContract.auth(permissionData, signature);
    console.log(receipt);
    // TODO CHECK IF THIS IS OK!
    return permissionId;
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

    if (!permissions['createGame']) {
      const permissionId = await createGamePermissions(
        actionEnv,
        firstAddress,
        secondAddress
      );
      permissions['createGame'] = permissionId;
    }

    console.log(populatedTransaction);
    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(actionEnv);
    const tx = await sendThroughAccount(
      permissions['createGame'],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      populatedTransaction.data!
    );
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    delete permissions['createGame'];
    return getComponentValue(CounterGame, singletonEntity);
  };

  const acceptGame = async (actionEnv: ActionEnv, gameId: string) => {
    const txData = await worldContract.populateTransaction.acceptGame(gameId);
    console.log(txData);

    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(actionEnv);
    const tx = await sendThroughAccount(permissions['acceptGame'], txData.data!);

    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(CounterGame, singletonEntity);
  };

  const increment = async (actionEnv: ActionEnv, gameId: string, message: string) => {
    const tx = await worldSend("increment", [gameId, message]);
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
    increment,
  };
}
