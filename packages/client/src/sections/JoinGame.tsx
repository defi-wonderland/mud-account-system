import { useState } from "react";
import { useMUD } from "../MUDContext";

interface JoinGameProps {
  signMessage: (message: string) => Promise<string | undefined>;
}

export const JoinGame = ({ signMessage }: JoinGameProps) => {
  const {
    systemCalls: { acceptGame },
  } = useMUD();

  return (
    <div className="section">
      <h1>Join Game Section</h1>

      <br />
      <button
        onClick={async () => {
          await acceptGame("0x01");
        }}
      >
        Accept Game
      </button>
    </div>
  );
};
