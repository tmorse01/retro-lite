"use client";

import { useEffect, useState } from "react";
import { BoardLayout } from "./BoardLayout";
import { Column } from "./Column";
import type { BoardWithDetails, Card, Column as ColumnType } from "@/types/database";

interface BoardViewProps {
  boardId: string;
}

export function BoardView({ boardId }: BoardViewProps) {
  const [board, setBoard] = useState<BoardWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial board data
    fetch(`/api/boards/${boardId}`)
      .then((res) => res.json())
      .then((data) => {
        setBoard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading board:", err);
        setError("Failed to load board");
        setLoading(false);
      });

    // TODO: Enable realtime subscriptions for live collaboration
    // Uncomment the following code to enable realtime updates:
    /*
    import { subscribeToBoardCards } from "@/lib/supabase/realtime";
    
    const unsubscribe = subscribeToBoardCards(
      boardId,
      (newCard) => {
        // Handle new card inserted
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: [...prev.cards, newCard],
          };
        });
      },
      (updatedCard) => {
        // Handle card updated
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === updatedCard.id ? updatedCard : card
            ),
          };
        });
      },
      (deletedCardId) => {
        // Handle card deleted
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.filter((card) => card.id !== deletedCardId),
          };
        });
      }
    );

    return () => {
      unsubscribe();
    };
    */
  }, [boardId]);

  const handleAddCard = async (
    columnId: string,
    content: string,
    author?: string
  ) => {
    // TODO: Replace with actual API call
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          columnId,
          content,
          author,
        }),
      });

      if (response.ok) {
        const newCard = await response.json();
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: [...prev.cards, newCard],
          };
        });
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleVote = async (cardId: string) => {
    // TODO: Replace with actual API call
    try {
      const response = await fetch(`/api/cards/${cardId}/vote`, {
        method: "POST",
      });

      if (response.ok) {
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === cardId
                ? { ...card, votes: card.votes + 1 }
                : card
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleUpdateCard = async (
    cardId: string,
    content: string,
    author?: string
  ) => {
    // TODO: Replace with actual API call
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author }),
      });

      if (response.ok) {
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === cardId
                ? { ...card, content, author: author || null }
                : card
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    // TODO: Replace with actual API call
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.filter((card) => card.id !== cardId),
          };
        });
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

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

