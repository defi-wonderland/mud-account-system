import "./styles.css";

import { CreateGame, Game, JoinGame, Profile } from "./sections";
import { useDataContext } from "./context";

export const App = () => {
  const { account } = useDataContext().actionEnv.provider;
  return (
    <>
      {/* Profile section */}
      <Profile />
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
