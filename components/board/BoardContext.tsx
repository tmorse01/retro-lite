"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Card, Group, BoardPhase } from "@/types/database";

interface BoardContextValue {
  phase: BoardPhase;
  groups: Group[];
  selectedCards: Set<string>;
  allCards: Card[];
  isGroupingMode: boolean;
  onCreateGroup?: (columnId: string, name: string, cardIds: string[]) => void;
  onAddCardsToGroup?: (groupId: string, cardIds: string[]) => void;
  onUngroupCard?: (cardId: string) => void;
  onSelectChange?: (cardId: string, selected: boolean) => void;
}

const BoardContext = createContext<BoardContextValue | undefined>(undefined);

interface BoardContextProviderProps {
  children: ReactNode;
  value: BoardContextValue;
}

export function BoardContextProvider({
  children,
  value,
}: BoardContextProviderProps) {
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoardContext must be used within BoardContextProvider");
  }
  return context;
}
