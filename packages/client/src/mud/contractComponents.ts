/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    CounterGame: (() => {
      const tableId = new TableId("", "CounterGame");
      return defineComponent(
        world,
        {
          player1: RecsType.String,
          player2: RecsType.String,
          winner: RecsType.String,
          player1Consent: RecsType.Boolean,
          player2Consent: RecsType.Boolean,
          counter: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    AccountFactorySingleton: (() => {
      const tableId = new TableId("", "AccountFactorySi");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
  };
}
