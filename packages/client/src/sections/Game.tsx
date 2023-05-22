import { useComponentValue, useRows } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useDataContext } from "../context";

export const Game = () => {
  const {
    components: { CounterGame, AccountFactorySingleton },
    network: { singletonEntity, storeCache },
    systemCalls: { increment },
  } = useMUD();
  const { actionEnv } = useDataContext();

  return (
    <div className="section">
      <h1>Game Section</h1>
      <br />
      <br />
      <br />
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "new counter value:",
            await increment(
              actionEnv,
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              ""
            )
          );
        }}
      >
        Increment
      </button>
    </div>
  );
};
