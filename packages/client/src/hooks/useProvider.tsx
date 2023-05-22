import { useEffect, useState } from "react";
import { providers } from "ethers";

interface ProviderState {
  provider?: providers.JsonRpcProvider | undefined;
  signer?: providers.JsonRpcSigner | undefined;
  signerAddress?: string;
  chainId?: number;
  gameProvider: providers.JsonRpcProvider | undefined;
}

export const useProvider = () => {
  const [state, setState] = useState<ProviderState>({
    gameProvider: new providers.JsonRpcProvider(),
  });
  const [account, setAccount] = useState("");

  const { provider, signer, signerAddress, chainId, gameProvider } = state;

  const connect = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await signer.getChainId();
      setState({ ...state, provider, signer, signerAddress: address, chainId });
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
    signerAddress,
    chainId,
    connect,
    signMessage,
    gameProvider,
    account,
    setAccount,
  };
};
