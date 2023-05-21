import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    CounterGame: {
      schema: {
        player1: "address",
        player2: "address",
        winner: "address",
        player1Consent:"bool",
        player2Consent:"bool",
        counter: "uint16",
      },
    },
    AccountFactorySingleton: {
      keySchema: {},
      schema: "address",
    },
  },
  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [],
    }
  ]
});
