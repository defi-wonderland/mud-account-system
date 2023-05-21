import { useMUD } from "../MUDContext";

interface ProfileProps {
  account?: string;
  chainId?: number;
  connect?: () => void;
}

export const Profile = ({ account, chainId, connect }: ProfileProps) => {
  const {
    systemCalls: { createAccount },
  } = useMUD();

  return (
    <div className="section profile">
      <h1>Profile Section</h1>
      <br />
      <br />
      <button onClick={connect} disabled={!account}>
        {account ? "Connected" : "Connect"}
      </button>
      <br />
      <br />
      <p>Account address: {account}</p>
      <p>ChainId: {chainId}</p>
      <br />
      <button onClick={createAccount}>Create Account</button>
      <br />
    </div>
  );
};
