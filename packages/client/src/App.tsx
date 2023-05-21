import "./styles.css";

import { useProvider } from "./hooks";
import { CreateGame, Game, JoinGame, Profile } from "./sections";

export const App = () => {
  const { connect, signMessage, account, chainId } = useProvider();

  return (
    <>
      {/* Profile section */}
      <Profile account={account} chainId={chainId} connect={connect} />
      {account && (
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
