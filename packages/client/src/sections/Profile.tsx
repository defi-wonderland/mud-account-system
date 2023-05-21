import { useMUD } from "../MUDContext";

interface ProfileProps {
  signer?: string;
  account?: string;
  burner?: string;
  chainId?: number;
  connect?: () => void;
}

export const Profile = ({ account, burner, signer, chainId, connect }: ProfileProps) => {
  const {
    systemCalls: { createAccount },
  } = useMUD();

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
      <p>Signer address: {signer}</p>
      <p>ChainId: {chainId}</p>
      <br />
      <p>Burner address: {burner}</p>
      <br />
      <button onClick={createAccount}>Create Account</button>
      <br />
      <br />
      <p>Signer Accounts:</p>
      <p>Account address: {account}</p>
      <br />
    </div>
  );
};
