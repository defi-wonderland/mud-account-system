import "./styles.css";

import { useProvider } from "./hooks";
import { CreateGame, Game, JoinGame, Profile } from "./sections";

export const App = () => {
  const { connect, signerAddress, chainId, account, setAccount } =
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
          <CreateGame />

          {/* Join Game Section */}
          <JoinGame />

          {/* Game Section */}
          <Game />
        </>
      )}
    </>
  );
};
