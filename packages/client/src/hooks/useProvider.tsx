import { useEffect, useState } from "react";
import { providers } from "ethers";

interface ProviderState {
  provider?: providers.JsonRpcProvider | undefined;
  signer?: providers.JsonRpcSigner | undefined;
  account?: string;
  chainId?: number;
}

export const useProvider = () => {
  const [state, setState] = useState<ProviderState>({});
  const { provider, signer, account, chainId } = state;

  const connect = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();
      setState({ provider, signer, account: address, chainId });
    }
  };

  const signMessage = async (message: string) => {
    if (signer) {
      return await signer.signMessage(message);
    }
  };

  // Connect on load
  useEffect(() => {
    connect();
  }, []);

  return {
    provider,
    signer,
    account,
    chainId,
    connect,
    signMessage,
  };
};
