import { useState } from "react";
import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";

interface CreateGameProps {
  signMessage: (message: string) => Promise<string | undefined>;
}

export const CreateGame = ({ signMessage }: CreateGameProps) => {
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");

  const {
    systemCalls: { createGame },
    components: { CounterGame },
  } = useMUD();
  const games = useEntityQuery([Has(CounterGame)]);
  return (
    <div className="section">
      <h1>Create Game Section</h1>
      <br />
      <p>player 1:</p>
      <input value={player1} onChange={(e) => setPlayer1(e.target.value)} />
      <br />
      <br />
      <p>player 2:</p>
      <input value={player2} onChange={(e) => setPlayer2(e.target.value)} />
      <br />
      <br />
      <button
        onClick={async () => {
          const test = await createGame(player1, player2);
          console.log(test);
        }}
      >
        Create Game
      </button>
      <br />
      <p>Open games:</p>
      {[...games].map((id, index) => {
        const game = getComponentValueStrict(CounterGame, id);
        console.log(game);
        return (
          <div className="section" key={game.player1 + index}>
            <p>player 1:{game.player1.slice(0, 6)}</p>
            <p>player 2:{game.player2.slice(0, 6)}</p>
          </div>
        );
      })}
    </div>
  );
};
