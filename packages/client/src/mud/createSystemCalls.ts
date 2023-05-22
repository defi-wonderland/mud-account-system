import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ethers } from "ethers";
import { ActionEnv } from "../context";
import AuthControllerABI from "../abi/AuthController.sol/AuthController.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {
  const permissions: any = {};

  const getPermissionData = async (actionEnv: ActionEnv, limitData: any) => {
    const authController = await worldContract.getAuthController();
    const authControllerContract = new ethers.Contract(
      authController,
      AuthControllerABI,
      (await actionEnv.accountSystem.getBurnerWalletProvider()).provider
    );

    console.log(authControllerContract);

    const touple = {
      authController: await worldContract.getAuthController(),
      client: (await actionEnv.accountSystem.getBurnerWalletProvider()).address,
      world: worldContract.address,
      limitChecker: await worldContract.getAccountSystemAddress(),
      limitData: limitData,
    };
    console.log(touple);

    return await authControllerContract.callStatic.getPermissionDataHash(
      touple
    );
  };

  const getSignature = async (actionEnv: ActionEnv, permissionData: any) => {
    // TODO Ardy please fix this
    return await actionEnv.provider.signer?.signMessage(permissionData);
  };

  const createGamePermissions = async (
    actionEnv: ActionEnv,
    firstAddress: string,
    secondAddress: string
  ) => {
    console.log('createGamePermissions')
    const populatedTransaction =
      await worldContract.populateTransaction.createGame(
        firstAddress,
        secondAddress
      );
    if (!populatedTransaction || !populatedTransaction.data) throw new Error('No populatedTransaction');
    
    console.log('populatedTransaction', populatedTransaction.data)
    console.log('worldContract', worldContract)

    const limitData = await worldContract.getLimitData(
      populatedTransaction.data
    );
    console.log('limitData', limitData)

    const permissionData = await getPermissionData(actionEnv, limitData);
    const signature = await getSignature(actionEnv, permissionData);
    console.log("signature");
    console.log(signature);
    const accountContract = await actionEnv.accountSystem.getAccountContract(
      actionEnv
    );
    console.log("accountContract");
    console.log(accountContract);
    const permissionId = await accountContract.callStatic.auth(
      permissionData,
      signature
    );
    console.log("permissionId", permissionId);
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
    console.log("createGame");
    const populatedTransaction =
      await worldContract.populateTransaction.createGame(
        firstAddress,
        secondAddress
      );
    console.log('populatedTransaction');
    if (!permissions["createGame"]) {
      console.log('!permission');
      const permissionId = await createGamePermissions(
        actionEnv,
        firstAddress,
        secondAddress
      );
      console.log('permissionId', permissionId)
      permissions["createGame"] = permissionId;
    }

    console.log(populatedTransaction);
    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    console.log(1);
    const tx = await sendThroughAccount(
      permissions["createGame"],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      populatedTransaction.data!
    );
    console.log(2);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    console.log(3);
    delete permissions["createGame"];
    console.log(4);
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
