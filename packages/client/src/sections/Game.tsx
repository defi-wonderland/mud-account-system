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
  const [winner, setWinner] = useState("");
  const counterKey = useEntityQuery([Has(CounterGame)]);

  const getCounter = async () => {
    try {
      const counterValue = getComponentValueStrict(CounterGame, counterKey[0]);

      setCounter(counterValue.counter);
      setWinner(counterValue.winner);
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
      <p>
        Winner:{" "}
        {winner === "0x0000000000000000000000000000000000000000"
          ? "??"
          : winner}
      </p>
      <br />
      <p>Counter: {`${counter}/20` || "??"}</p>
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
