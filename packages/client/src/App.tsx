import "./styles.css";

import { useProvider } from "./hooks";
import { CreateGame, Game, JoinGame, Profile } from "./sections";

export const App = () => {
  const { connect, signMessage, signerAddress, chainId, account, setAccount } =
    useProvider();

  return (
    <>
      {/* Profile section */}
      <Profile
        signerAddress={signerAddress}
        chainId={chainId}
        connect={connect}
        account={account}
        setAccount={setAccount}
      />
      {account && (
        <>
          {/* Game Creation Section */}
          <CreateGame signMessage={signMessage} account={account} />

          {/* Join Game Section */}
          <JoinGame signMessage={signMessage} />

          {/* Game Section */}
          <Game />
        </>
      )}
    </>
  );
};
