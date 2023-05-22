import { useState } from "react";
import { useMUD } from "../MUDContext";
import { ActionEnv } from "./CreateGame";
import { useAccountSystem, useProvider } from "../hooks";

export const JoinGame = () => {
  const [gameId, setGameId] = useState<string>("1");

  const {
    systemCalls: { acceptGame },
  } = useMUD();

  const actionEnv: ActionEnv = {
    accountSystem: useAccountSystem(),
    provider: useProvider(),
  };

  const handleId = (id: string) => {
    return `0x000000000000000000000000000000000000000000000000000000000000000${id}`;
  };

  return (
    <div className="section">
      <h1>Join Game Section</h1>

      <br />
      <p>game key:</p>
      <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
      <br />
      <button
        onClick={async () => await acceptGame(actionEnv, handleId(gameId))}
      >
        Accept Game
      </button>
    </div>
  );
};
