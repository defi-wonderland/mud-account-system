import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { ethers } from "ethers";
import { ActionEnv } from "../context";
import AuthControllerABI from "../../../contracts/out/AuthController.sol/AuthController.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, worldContract }: SetupNetworkResult,
  { CounterGame }: ClientComponents
) {
  const permissions: any = {};

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
      const permissionId = await authPermissions(actionEnv, populatedTransaction.data!);
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
    const populateTransaction = await worldContract.populateTransaction.acceptGame(gameId);
    if (!permissions["acceptGame"]) {
      const permissionId = await authPermissions(actionEnv, populateTransaction.data!);
      permissions["acceptGame"] = permissionId;
    }

    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tx = await sendThroughAccount(
      permissions["acceptGame"],
      populateTransaction.data!
    );

    console.log("ACCEPTED GAME")
    delete permissions["acceptGame"];
    console.log("ACCEPTED GAME AFTER WAIT")
    return getComponentValue(CounterGame, singletonEntity);
  };

  const increment = async (
    actionEnv: ActionEnv,
    gameId: string,
    message: string
  ) => {
    const populateTransaction = await worldContract.populateTransaction.increment(
      gameId,
      message
    );
    if (!permissions["increment"]) {
      const permissionId = await authPermissions(actionEnv, populateTransaction.data!.substring(0,74));
      permissions["increment"] = permissionId;
    }
    const sendThroughAccount = await actionEnv.accountSystem.sendThrough(
      actionEnv
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tx = await sendThroughAccount(permissions["increment"], populateTransaction.data!);
  };

  const authPermissions = async (
    actionEnv: ActionEnv,
    populatedTransactionData: string
  ) => {
    const limitData = await worldContract.callStatic.getLimitData(
      populatedTransactionData
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
  }


  const getPermissionData = async (actionEnv: ActionEnv, limitData: any) => {
    const authController = await worldContract.getAuthController();
    const authControllerContract = new ethers.Contract(
      authController,
      AuthControllerABI,
      (await actionEnv.accountSystem.getBurnerWalletProvider()).provider
    );

    const touple = {
      authController: await worldContract.getAuthController(),
      client: (await actionEnv.accountSystem.getBurnerWalletProvider()).address,
      world: worldContract.address,
      limitChecker: await worldContract.getAccountSystemAddress(),
      limitData: limitData,
    };

    return {
      data: touple,
      hash: await authControllerContract.callStatic.getPermissionDataHash(touple)
    };
  };

  const getSignature = async (actionEnv: ActionEnv, permissionData: any) => {
    return await actionEnv.provider.signer?.signMessage(permissionData);
  };

  return {
    createGame,
    acceptGame,
    createAccount,
    increment,
  };
}
