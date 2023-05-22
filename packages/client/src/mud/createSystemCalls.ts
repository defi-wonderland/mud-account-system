import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ethers } from "ethers";
import { ActionEnv } from "../context";
import AuthControllerABI from "../../../contracts/out/AuthController.sol/AuthController.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract, fastTxExecutor }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {
  if (!fastTxExecutor) return;
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

    return {
      data: touple,
      hash: await authControllerContract.callStatic.getPermissionDataHash(touple)
    };
  };

  const getSignature = async (actionEnv: ActionEnv, permissionData: any) => {
    return await actionEnv.provider.signer?.signMessage(permissionData);
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
    if (!populatedTransaction || !populatedTransaction.data) throw new Error('No populatedTransaction');
    

    const limitData = await worldContract.callStatic.getLimitData(
      populatedTransaction.data
    );

    const permissionData = await getPermissionData(actionEnv, limitData);
    const signature = await getSignature(actionEnv, permissionData.hash);
    const accountContract = await actionEnv.accountSystem.getAccountContract(
      actionEnv
    );
    const permissionId = await accountContract.callStatic.auth(
      permissionData.data,
      signature
    );
    await accountContract.auth(permissionData.data, signature, {
      type: 2,
      maxFeePerGas: 0,
      maxPriorityFeePerGas: 0,
      gasLimit: 1000000,
    });
    
    console.log("AUTH SUCCESSFULL")
    // TODO CHECK IF THIS IS OK!
    return permissionId.toNumber();
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

    console.log("ACCEPTED GAME")
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    console.log("ACCEPTED GAME AFTER WAIT")
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
