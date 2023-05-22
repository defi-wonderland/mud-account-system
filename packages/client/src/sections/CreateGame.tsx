import { useState } from "react";
import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useAccountSystem, useProvider } from "../hooks";

export type ActionEnv = {
  accountSystem: ReturnType<typeof useAccountSystem>;
  provider: ReturnType<typeof useProvider>;
};

export const CreateGame = () => {
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");

  const {
    systemCalls: { createGame },
    components: { CounterGame },
  } = useMUD();

  const actionEnv: ActionEnv = {
    accountSystem: useAccountSystem(),
    provider: useProvider(),
  };

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
          await createGame(actionEnv, player1, player2);
        }}
      >
        Create Game
      </button>
      <br />
      <br />
      <p>Open games:</p>
      {[...games].map((id, index) => {
        const game = getComponentValueStrict(CounterGame, id);
        return (
          <div className="section" key={game.player1 + index}>
            <p>game id:{id}</p>
            <p>
              player 1:{game.player1}, ready:{" "}
              {game.player1Consent ? "yes" : "no"}
            </p>
            <p>
              player 2:{game.player2}, ready{" "}
              {game.player2Consent ? "yes" : "no"}
            </p>
          </div>
        );
      })}
    </div>
  );
};
