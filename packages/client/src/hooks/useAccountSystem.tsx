import { ethers, providers } from "ethers";
import AccountSystemABI from "../abi/AccountSystem.sol/AccountSystem.abi.json";
import { getNetworkConfig } from "../mud/getNetworkConfig";

export const useAccountSysten = () => {
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
  };

  return {
    getAccounts,
  };
};
