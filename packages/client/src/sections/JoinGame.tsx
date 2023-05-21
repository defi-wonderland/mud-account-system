import { useState } from "react";
import { useMUD } from "../MUDContext";
import { ethers } from "ethers";

interface JoinGameProps {
  signMessage: (message: string) => Promise<string | undefined>;
}

export const JoinGame = ({ signMessage }: JoinGameProps) => {
  const [gameId, setGameId] = useState<string>(
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );

  const {
    systemCalls: { acceptGame },
  } = useMUD();

  return (
    <div className="section">
      <h1>Join Game Section</h1>

      <br />
      <p>game key:</p>
      <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
      <br />
      <button onClick={async () => await acceptGame(gameId)}>
        Accept Game
      </button>
    </div>
  );
};
