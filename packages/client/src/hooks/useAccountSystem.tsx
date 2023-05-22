import { Wallet, ethers, providers } from "ethers";
import AccountSystemABI from "../abi/AccountSystem.sol/AccountSystem.abi.json";
import AccountABI from "../abi/Account.sol/Account.abi.json";
import { getNetworkConfig } from "../mud/getNetworkConfig";
import { getBurnerWallet } from "@latticexyz/std-client";

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

  const sendThrough = async (account: string) => {
    const provider = new providers.JsonRpcProvider(
      (await getNetworkConfig()).provider.jsonRpcUrl
    );
    const burnerWallet = new Wallet(getBurnerWallet().value, provider);

    const accountContract = new ethers.Contract(
      account,
      AccountABI,
      burnerWallet
    );

    return (permissionId: string, data: string) => {
      return accountContract.execute(permissionId, data);
    };
  };

  return {
    getAccounts,
    sendThrough,
  };
};
