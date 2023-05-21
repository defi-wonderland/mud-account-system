import "./styles.css";

import { useProvider } from "./hooks";
import { CreateGame, Game, JoinGame, Profile } from "./sections";

export const App = () => {
  const { connect, signMessage, signerAddress, chainId } = useProvider();

  return (
    <>
      {/* Profile section */}
      <Profile
        signerAddress={signerAddress}
        chainId={chainId}
        connect={connect}
      />
      {signerAddress && (
        <>
          {/* Game Creation Section */}
          <CreateGame signMessage={signMessage} />

          {/* Join Game Section */}
          <JoinGame signMessage={signMessage} />

          {/* Game Section */}
          <Game />
        </>
      )}
    </>
  );
};
