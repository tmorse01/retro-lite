"use client";

import { useState } from "react";
import { BoardLayout } from "./BoardLayout";
import { Column } from "./Column";
import { useBoard } from "@/hooks/useBoard";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Card } from "@/types/database";

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const {
    board,
    loading,
    error,
    loadingActions,
    handleAddCard,
    handleVote,
    handleUpdateCard,
    handleDeleteCard,
    handleCreateGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleUngroupCard,
    handleAddCardsToGroup,
    handlePhaseChange,
  } = useBoard(boardId);

  const handleSelectChange = (cardId: string, selected: boolean) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }
      return next;
    });
  };

  const handleCreateGroupFromSelection = async (name: string) => {
    if (!board || selectedCards.size === 0) return;

    // Group selected cards by column
    const cardsByColumn = new Map<string, string[]>();
    Array.from(selectedCards).forEach((cardId) => {
      const card = board.cards.find((c) => c.id === cardId);
      if (card) {
        const existing = cardsByColumn.get(card.column_id) || [];
        existing.push(cardId);
        cardsByColumn.set(card.column_id, existing);
      }
    });

    // Create a group for each column that has selected cards
    for (const [columnId, cardIds] of cardsByColumn.entries()) {
      if (cardIds.length > 0) {
        await handleCreateGroup(columnId, name, cardIds);
      }
    }

    setSelectedCards(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header skeleton */}
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-px" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </header>

        {/* Content skeleton */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col h-full bg-white rounded-lg border p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="flex-1 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="bg-white rounded-lg border p-4 space-y-2"
                    >
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-16 mt-2" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-destructive">
            {error || "Board not found"}
          </div>
        </div>
      </div>
    );
  }

  // Sort columns by sort_order
  const sortedColumns = [...board.columns].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  // Sort cards by votes (descending) within each column
  const getCardsForColumn = (columnId: string): Card[] => {
    return board.cards
      .filter((card) => card.column_id === columnId)
      .sort((a, b) => b.votes - a.votes);
  };

  const getGroupsForColumn = (columnId: string) => {
    return board.groups.filter((group) => group.column_id === columnId);
  };

  // Automatically enable grouping mode when phase is "grouping"
  const isGroupingMode = board.phase === "grouping";

  return (
    <BoardLayout
      boardTitle={board.title}
      boardId={board.id}
      phase={board.phase}
      onPhaseChange={handlePhaseChange}
      isGroupingMode={isGroupingMode}
      selectedCards={selectedCards}
      onCreateGroup={handleCreateGroupFromSelection}
      onClearSelection={() => setSelectedCards(new Set())}
      board={board}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={getCardsForColumn(column.id)}
            groups={getGroupsForColumn(column.id)}
            onAddCard={handleAddCard}
            onVote={handleVote}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onRenameGroup={handleRenameGroup}
            onDeleteGroup={handleDeleteGroup}
            onUngroupCard={handleUngroupCard}
            onAddCardsToGroup={handleAddCardsToGroup}
            isAddingCard={loadingActions.addingCard === column.id}
            votingCards={loadingActions.voting}
            updatingCards={loadingActions.updating}
            deletingCards={loadingActions.deleting}
            isGroupingMode={isGroupingMode}
            selectedCards={selectedCards}
            onSelectChange={handleSelectChange}
            phase={board.phase}
          />
        ))}
      </div>
    </BoardLayout>
  );
}
