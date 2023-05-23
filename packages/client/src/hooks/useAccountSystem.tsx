import { Wallet, ethers, providers } from "ethers";
import AccountSystemABI from "../../abi/AccountSystem.sol/AccountSystem.abi.json";
import CounterGameSystemABI from "../../abi/CounterGameSystem.sol/CounterGameSystem.abi.json";
import AccountABI from "../../abi/Account.sol/Account.abi.json";
import { getNetworkConfig } from "../mud/getNetworkConfig";
import { getBurnerWallet } from "@latticexyz/std-client";
import { ActionEnv } from "../context";

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
  };

  const getAccountContract = async (actionEnv: ActionEnv) => {
    const burnerWallet = await getBurnerWalletProvider();
    return new ethers.Contract(
      actionEnv.provider.account,
      AccountABI,
      new providers.JsonRpcProvider()
    ).connect(burnerWallet);
  };

  const getGameContract = async (contractAddress: string) => {
    const burnerWallet = await getBurnerWalletProvider();
    return new ethers.Contract(
      contractAddress,
      CounterGameSystemABI,
      new providers.JsonRpcProvider()
    ).connect(burnerWallet);
  };

  return {
    getAccounts,
    getAccountContract,
    getBurnerWalletProvider,
    getGameContract,
  };
};
