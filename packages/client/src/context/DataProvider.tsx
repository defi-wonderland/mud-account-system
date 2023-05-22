import { createContext, useContext } from "react";

import { useAccountSystem, useProvider } from "../hooks";

export type ActionEnv = {
  accountSystem: ReturnType<typeof useAccountSystem>;
  provider: ReturnType<typeof useProvider>;
};

type ContextType = {
  actionEnv: ActionEnv;
};

const DataContext = createContext({} as ContextType);

interface ContextProps {
  children: React.ReactElement;
}
export const DataProvider = ({ children }: ContextProps) => {
  const actionEnv: ActionEnv = {
    accountSystem: useAccountSystem(),
    provider: useProvider(),
  };

  return (
    <DataContext.Provider value={{ actionEnv }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  return context;
};
