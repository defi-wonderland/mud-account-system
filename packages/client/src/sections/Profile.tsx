import { useEffect, useState } from "react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";

import { useAccountSysten } from "../hooks";
import { useMUD } from "../MUDContext";

interface ProfileProps {
  signer?: string;
  signerAddress?: string;
  burner?: string;
  chainId?: number;
  connect?: () => void;
}

export const Profile = ({
  signerAddress,
  burner,
  signer,
  chainId,
  connect,
}: ProfileProps) => {
  const {
    systemCalls: { createAccount },
    components: { AccountFactorySingleton },
  } = useMUD();
  const { getAccounts } = useAccountSysten();
  const [accounts, setAccounts] = useState<string[]>([]);
  const accountSystemId = useEntityQuery([Has(AccountFactorySingleton)]);

  useEffect(() => {
    try {
      // temporary fixed value:
      const burner = "0x031f180be76498d769a66eca7e57cb44622116b7";

      const accountFactory = getComponentValueStrict(
        AccountFactorySingleton,
        accountSystemId[0]
      ).value;

      getAccounts(accountFactory, burner, "0").then((address) => {
        setAccounts([...accounts, address]);
      });
    } catch (error) {
      console.log("error gettting AccountSystem");
    }
  }, [accountSystemId]);

  return (
    <div className="section profile">
      <h1>Profile Section</h1>
      <br />
      <br />
      <button onClick={connect} disabled={!signer}>
        {signer ? "Connected" : "Connect"}
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
      <p>Account contract: {accounts[0] || ""}</p>
      <br />
    </div>
  );
};
