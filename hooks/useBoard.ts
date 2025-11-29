import { useEffect, useState } from "react";
import { subscribeToBoardCards } from "@/lib/supabase/realtime";
import type { BoardWithDetails } from "@/types/database";

export function useBoard(boardId: string) {
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

    // Subscribe to realtime updates for live collaboration
    const unsubscribe = subscribeToBoardCards(
      boardId,
      (newCard) => {
        // Handle new card inserted (only add if it doesn't already exist)
        setBoard((prev) => {
          if (!prev) return null;
          // Check if card already exists (to prevent duplicates from optimistic updates)
          const cardExists = prev.cards.some((card) => card.id === newCard.id);
          if (cardExists) return prev;
          return {
            ...prev,
            cards: [...prev.cards, newCard],
          };
        });
      },
      (updatedCard) => {
        // Handle card updated (includes vote updates)
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
  }, [boardId]);

  const handleAddCard = async (
    columnId: string,
    content: string,
    author?: string
  ) => {
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

      if (!response.ok) {
        console.error("Error adding card:", await response.text());
      }
      // Realtime subscription will handle updating the UI
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleVote = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}/vote`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Error voting:", await response.text());
      }
      // Realtime subscription will handle updating the UI
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleUpdateCard = async (
    cardId: string,
    content: string,
    author?: string
  ) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author }),
      });

      if (!response.ok) {
        console.error("Error updating card:", await response.text());
      }
      // Realtime subscription will handle updating the UI
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Error deleting card:", await response.text());
      }
      // Realtime subscription will handle updating the UI
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return {
    board,
    loading,
    error,
    handleAddCard,
    handleVote,
    handleUpdateCard,
    handleDeleteCard,
  };
}
