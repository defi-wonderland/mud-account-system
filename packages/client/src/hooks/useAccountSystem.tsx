import { Wallet, ethers, providers } from "ethers";
import AccountSystemABI from "../../../contracts/out/AccountSystem.sol/AccountSystem.abi.json";
import AccountABI from "../../../contracts/out/Account.sol/Account.abi.json";
import CounterGameSystemABI from "../../../contracts/out/CounterGameSystem.sol/CounterGameSystem.abi.json";
import { getNetworkConfig } from "../mud/getNetworkConfig";
import { getBurnerWallet } from "@latticexyz/std-client";
import { ActionEnv } from "../context";
import { IWorld } from "contracts/types/ethers-contracts/IWorld";

export const useAccountSystem = () => {
  const getAccounts = async (
    accountFactory: string,
    burnerAccount: string,
    index: string
  ) => {
    const accountFactoryContract = new ethers.Contract(
      accountFactory,
      AccountSystemABI,
      new providers.JsonRpcProvider()
    );

    return accountFactoryContract.ownerAccounts(burnerAccount, index);
  };

  const getBurnerWalletProvider = async () => {
    const provider = new providers.JsonRpcProvider(
      (await getNetworkConfig()).provider.jsonRpcUrl
    );
    return new Wallet(getBurnerWallet().value, provider);
  }

  const getAccountContract = async (actionEnv: ActionEnv) => {
    const burnerWallet = await getBurnerWalletProvider();
    return new ethers.Contract(
      actionEnv.provider.account,
      AccountABI,
      new providers.JsonRpcProvider()
    ).connect(burnerWallet);
  }

  const getCounterGameSystemContract = async (actionEnv: ActionEnv, worldContract: IWorld) => {
    const burnerWallet = await getBurnerWalletProvider();
    const counterGameSystemAddress = await worldContract.getCounterGameSystemAddress();
    
    return new ethers.Contract(
      counterGameSystemAddress,
      CounterGameSystemABI,
      new providers.JsonRpcProvider()
    ).connect(burnerWallet);
  }

  return {
    getAccounts,
    getAccountContract,
    getBurnerWalletProvider,
    getCounterGameSystemContract,
  };
};
