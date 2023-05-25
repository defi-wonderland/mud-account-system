import { useEffect, useState } from "react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { getBurnerWallet } from "@latticexyz/std-client";
import { Wallet } from "ethers";

import { useAccountSystem } from "../hooks";
import { useMUD } from "../MUDContext";
import { useDataContext } from "../context";

export const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { account, setAccount, signerAddress, chainId, connect } =
    useDataContext().actionEnv.provider;

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

      getAccounts(accountFactory, signerAddress!, "0").then((address) => {
        setAccount(address);
      });
    } catch (error) {
      console.log("error gettting AccountSystem");
    }
  };

  const handleCreateAccount = async () => {
    if (signerAddress) {
      setLoading(true);
      await createAccount(signerAddress);
      await handleGetAccounts();
      setLoading(false);
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
      <p>Burner address: {burnerWallet.address}</p>
      <br />
      <button onClick={handleCreateAccount}>Create Account</button>
      <br />
      <br />
      <br />
      <p>Created account:</p>
      <br />
      {loading && <p>Loading...</p>}
      {!loading && account && <p>{account}</p>}
      <br />
    </div>
  );
};
