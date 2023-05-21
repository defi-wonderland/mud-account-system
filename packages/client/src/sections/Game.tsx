import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";

export const Game = () => {
  const {
    components: { CounterGame, AccountFactorySingleton },
    network: { singletonEntity },
  } = useMUD();

  return (
    <div className="section">
      <h1>Game Section</h1>
      <div>{/* Counter: <span>{counter?.value ?? "??"}</span> */}</div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          // console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button>
    </div>
  );
};
