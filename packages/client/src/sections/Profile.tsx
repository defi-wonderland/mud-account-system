interface ProfileProps {
  account?: string;
  chainId?: number;
  connect?: () => void;
}

export const Profile = ({ account, chainId, connect }: ProfileProps) => {
  return (
    <div className="section profile">
      <h1>Profile Section</h1>
      <button onClick={connect} disabled={!account}>
        {account ? "Connected" : "Connect"}
      </button>
      <p>Account address: {account}</p>
      <p>ChainId: {chainId}</p>
    </div>
  );
};
