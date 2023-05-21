import { ethers, providers } from "ethers";
import AccountSystemABI from "../abi/AccountSystem.sol/AccountSystem.abi.json";
import AccountABI from "../abi/Account.sol/Account.abi.json";
import { getNetworkConfig } from "../mud/getNetworkConfig";

export const useAccountSystem = () => {
  const getAccounts = async (
    accountFactory: string,
    burnerAccount: string,
    index: string
  ) => {
    const accountFactoryContract = new ethers.Contract(
      accountFactory,
      AccountSystemABI,
      new providers.JsonRpcProvider((await getNetworkConfig()).provider.jsonRpcUrl)
    );

    return accountFactoryContract.ownerAccounts(burnerAccount, index);
  }

  const sendAsAccount = async (
    account: string,
    permissionId: string,
    data: string,
  ) => {
    const accountContract = new ethers.Contract(
      account,
      AccountABI,
      new providers.JsonRpcProvider((await getNetworkConfig()).provider.jsonRpcUrl)
    );

    return accountContract.execute(permissionId, data);
  }

  return {
    getAccounts,
    sendAsAccount,
  };
};
