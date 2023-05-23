import { useMUD } from "../MUDContext";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useDataContext } from "../context";
import { useEffect, useState } from "react";

export const Game = () => {
  const {
    components: { CounterGame },
    systemCalls: { increment },
  } = useMUD();
  const { actionEnv } = useDataContext();
  const [counter, setCounter] = useState(0);
  const counterKey = useEntityQuery([Has(CounterGame)]);

  const getCounter = async () => {
    try {
      const counterValue = getComponentValueStrict(
        CounterGame,
        counterKey[0]
      ).counter;

      setCounter(counterValue);
    } catch (error) {
      console.log("error gettting counter");
    }
  };

  useEffect(() => {
    getCounter();
  }, [counterKey]);
  return (
    <div className="section">
      <h1>Game Section</h1>
      <br />
      <br />
      <p>Counter: {counter || "??"}</p>
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
