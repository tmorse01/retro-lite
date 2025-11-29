"use client";

import { BoardLayout } from "./BoardLayout";
import { Column } from "./Column";
import { useBoard } from "@/hooks/useBoard";
import type { Card } from "@/types/database";

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const {
    board,
    loading,
    error,
    handleAddCard,
    handleVote,
    handleUpdateCard,
    handleDeleteCard,
  } = useBoard(boardId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading board...</div>
        </div>
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

  return (
    <BoardLayout boardTitle={board.title} boardId={board.id}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={getCardsForColumn(column.id)}
            onAddCard={handleAddCard}
            onVote={handleVote}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </div>
    </BoardLayout>
  );
}
