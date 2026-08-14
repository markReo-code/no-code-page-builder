"use client";

import type { BuilderState } from "@repo/ui/types/builder";
import { createContext, ReactNode, useContext, useReducer } from "react";
import { BuilderAction, builderReducer } from "../builderReducer";
import { initialState } from "../initialState";

type BuilderContextValue = {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
};

export const BuilderContext = createContext<BuilderContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export const BuilderProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  const context = useContext(BuilderContext);

  if (!context) {
    throw new Error("useBuilderContext must be used within BuilderProvider");
  }

  return context;
};
