import { useEffect } from "react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { getBurnerWallet } from "@latticexyz/std-client";
import { Wallet } from "ethers";

import { useAccountSystem } from "../hooks";
import { useMUD } from "../MUDContext";

interface ProfileProps {
  signerAddress?: string;
  burner?: string;
  chainId?: number;
  connect?: () => void;
  account: string;
  setAccount: (account: string) => void;
}

export const Profile = ({
  signerAddress,
  burner,
  chainId,
  connect,
  account,
  setAccount,
}: ProfileProps) => {
  const {
    systemCalls: { createAccount },
    components: { AccountFactorySingleton },
  } = useMUD();
  const { getAccounts } = useAccountSystem();
  const accountSystemId = useEntityQuery([Has(AccountFactorySingleton)]);
  const burnerWallet = new Wallet(getBurnerWallet().value);

  const handleGetAccounts = async () => {
    try {
      const burner = await burnerWallet.getAddress();
      const accountFactory = getComponentValueStrict(
        AccountFactorySingleton,
        accountSystemId[0]
      ).value;

      getAccounts(accountFactory, burner, "0").then((address) => {
        setAccount(address);
      });
    } catch (error) {
      console.log("error gettting AccountSystem");
    }
  };

  useEffect(() => {
    handleGetAccounts();
  }, [accountSystemId]);

  return (
    <div className="section profile">
      <h1>Profile Section</h1>
      <br />
      <br />
      <button onClick={connect} disabled={!signerAddress}>
        {signerAddress ? "Connected" : "Connect"}
      </button>
      <br />
      <br />
      <p>Signer address: {signerAddress}</p>
      <p>ChainId: {chainId}</p>
      <br />
      <p>Burner address: {burner}</p>
      <br />
      <button onClick={createAccount}>Create Account</button>
      <br />
      <br />
      <p>Signer Accounts:</p>
      <p>Account contract: {account || ""}</p>
      <br />
    </div>
  );
};
