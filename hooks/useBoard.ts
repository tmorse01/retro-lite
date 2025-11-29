import { useEffect, useState, useCallback, useRef } from "react";
import { subscribeToBoardCards } from "@/lib/supabase/realtime";
import type { BoardWithDetails, Card } from "@/types/database";

const LOADING_DELAY_MS = 200; // Only show spinner if operation takes longer than this

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<BoardWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingActions, setLoadingActions] = useState<{
    addingCard: string | null; // columnId
    voting: Set<string>; // cardIds
    updating: Set<string>; // cardIds
    deleting: Set<string>; // cardIds
  }>({
    addingCard: null,
    voting: new Set(),
    updating: new Set(),
    deleting: new Set(),
  });

  // Track timeouts for delayed loading states
  const loadingTimeouts = useRef<{
    addingCard: NodeJS.Timeout | null;
    voting: Map<string, NodeJS.Timeout>;
    updating: Map<string, NodeJS.Timeout>;
    deleting: Map<string, NodeJS.Timeout>;
  }>({
    addingCard: null,
    voting: new Map(),
    updating: new Map(),
    deleting: new Map(),
  });


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
        // Handle new card inserted
        setBoard((prev) => {
          if (!prev) return null;
          // Check if card already exists (to prevent duplicates from realtime)
          const cardExists = prev.cards.some((card) => card.id === newCard.id);
          if (cardExists) return prev;
          
          // Add the new card
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
      },
      (updatedBoard) => {
        // Handle board updated (e.g., phase change)
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...updatedBoard,
            // Keep existing columns and cards
            columns: prev.columns,
            cards: prev.cards,
          };
        });
      }
    );

    return () => {
      unsubscribe();
      // Cleanup all loading timeouts
      if (loadingTimeouts.current.addingCard) {
        clearTimeout(loadingTimeouts.current.addingCard);
      }
      loadingTimeouts.current.voting.forEach((timeout) => clearTimeout(timeout));
      loadingTimeouts.current.updating.forEach((timeout) => clearTimeout(timeout));
      loadingTimeouts.current.deleting.forEach((timeout) => clearTimeout(timeout));
    };
  }, [boardId]);

  const handleAddCard = useCallback(
    async (columnId: string, content: string, author?: string) => {
      // Generate UUID on frontend for optimistic update
      const cardId = crypto.randomUUID();
      const optimisticCard: Card = {
        id: cardId,
        board_id: boardId,
        column_id: columnId,
        content,
        author: author || null,
        votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistic update: add card immediately with real ID
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: [...prev.cards, optimisticCard],
        };
      });

      // Clear any existing timeout
      if (loadingTimeouts.current.addingCard) {
        clearTimeout(loadingTimeouts.current.addingCard);
      }

      // Set delayed loading state
      const timeoutId = setTimeout(() => {
        setLoadingActions((prev) => ({ ...prev, addingCard: columnId }));
      }, LOADING_DELAY_MS);
      loadingTimeouts.current.addingCard = timeoutId;

      try {
        const response = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: cardId, // Send the ID we generated
            boardId,
            columnId,
            content,
            author,
          }),
        });

        if (!response.ok) {
          // Rollback optimistic update on error
          setBoard((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              cards: prev.cards.filter((card) => card.id !== cardId),
            };
          });
          console.error("Error adding card:", await response.text());
        }
        // Card already exists with correct ID, realtime will just confirm it
      } catch (error) {
        // Rollback optimistic update on error
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.filter((card) => card.id !== cardId),
          };
        });
        console.error("Error adding card:", error);
      } finally {
        // Clear timeout if it hasn't fired yet
        if (loadingTimeouts.current.addingCard) {
          clearTimeout(loadingTimeouts.current.addingCard);
          loadingTimeouts.current.addingCard = null;
        }
        setLoadingActions((prev) => ({ ...prev, addingCard: null }));
      }
    },
    [boardId]
  );

  const handleVote = useCallback(async (cardId: string) => {
    // Optimistic update: increment vote count immediately
    setBoard((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cards: prev.cards.map((card) =>
          card.id === cardId ? { ...card, votes: card.votes + 1 } : card
        ),
      };
    });

    // Clear any existing timeout for this card
    const existingTimeout = loadingTimeouts.current.voting.get(cardId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set delayed loading state
    const timeoutId = setTimeout(() => {
      setLoadingActions((prev) => ({
        ...prev,
        voting: new Set(prev.voting).add(cardId),
      }));
    }, LOADING_DELAY_MS);
    loadingTimeouts.current.voting.set(cardId, timeoutId);

    try {
      const response = await fetch(`/api/cards/${cardId}/vote`, {
        method: "POST",
      });

      if (!response.ok) {
        // Rollback optimistic update on error
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === cardId
                ? { ...card, votes: Math.max(0, card.votes - 1) }
                : card
            ),
          };
        });
        console.error("Error voting:", await response.text());
      }
      // Realtime subscription will handle updating the UI with the real vote count
    } catch (error) {
      // Rollback optimistic update on error
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === cardId
              ? { ...card, votes: Math.max(0, card.votes - 1) }
              : card
          ),
        };
      });
      console.error("Error voting:", error);
    } finally {
      // Clear timeout if it hasn't fired yet
      const timeout = loadingTimeouts.current.voting.get(cardId);
      if (timeout) {
        clearTimeout(timeout);
        loadingTimeouts.current.voting.delete(cardId);
      }
      setLoadingActions((prev) => {
        const newVoting = new Set(prev.voting);
        newVoting.delete(cardId);
        return { ...prev, voting: newVoting };
      });
    }
  }, []);

  const handleUpdateCard = useCallback(
    async (cardId: string, content: string, author?: string) => {
      // Store original values for rollback
      const originalCard = board?.cards.find((c) => c.id === cardId);
      if (!originalCard) return;

      // Optimistic update: update card immediately
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  content,
                  author: author || null,
                  updated_at: new Date().toISOString(),
                }
              : card
          ),
        };
      });

      // Clear any existing timeout for this card
      const existingTimeout = loadingTimeouts.current.updating.get(cardId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set delayed loading state
      const timeoutId = setTimeout(() => {
        setLoadingActions((prev) => ({
          ...prev,
          updating: new Set(prev.updating).add(cardId),
        }));
      }, LOADING_DELAY_MS);
      loadingTimeouts.current.updating.set(cardId, timeoutId);

      try {
        const response = await fetch(`/api/cards/${cardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, author }),
        });

        if (!response.ok) {
          // Rollback optimistic update on error
          setBoard((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              cards: prev.cards.map((card) =>
                card.id === cardId ? originalCard : card
              ),
            };
          });
          console.error("Error updating card:", await response.text());
        }
        // Realtime subscription will handle updating the UI with the real data
      } catch (error) {
        // Rollback optimistic update on error
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === cardId ? originalCard : card
            ),
          };
        });
        console.error("Error updating card:", error);
      } finally {
        // Clear timeout if it hasn't fired yet
        const timeout = loadingTimeouts.current.updating.get(cardId);
        if (timeout) {
          clearTimeout(timeout);
          loadingTimeouts.current.updating.delete(cardId);
        }
        setLoadingActions((prev) => {
          const newUpdating = new Set(prev.updating);
          newUpdating.delete(cardId);
          return { ...prev, updating: newUpdating };
        });
      }
    },
    [board]
  );

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      // Store original card for rollback
      const originalCard = board?.cards.find((c) => c.id === cardId);
      if (!originalCard) return;

      // Optimistic update: remove card immediately
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards.filter((card) => card.id !== cardId),
        };
      });

      // Clear any existing timeout for this card
      const existingTimeout = loadingTimeouts.current.deleting.get(cardId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set delayed loading state
      const timeoutId = setTimeout(() => {
        setLoadingActions((prev) => ({
          ...prev,
          deleting: new Set(prev.deleting).add(cardId),
        }));
      }, LOADING_DELAY_MS);
      loadingTimeouts.current.deleting.set(cardId, timeoutId);

      try {
        const response = await fetch(`/api/cards/${cardId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Rollback optimistic update on error
          setBoard((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              cards: [...prev.cards, originalCard],
            };
          });
          console.error("Error deleting card:", await response.text());
        }
        // Realtime subscription will handle updating the UI
      } catch (error) {
        // Rollback optimistic update on error
        setBoard((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: [...prev.cards, originalCard],
          };
        });
        console.error("Error deleting card:", error);
      } finally {
        // Clear timeout if it hasn't fired yet
        const timeout = loadingTimeouts.current.deleting.get(cardId);
        if (timeout) {
          clearTimeout(timeout);
          loadingTimeouts.current.deleting.delete(cardId);
        }
        setLoadingActions((prev) => {
          const newDeleting = new Set(prev.deleting);
          newDeleting.delete(cardId);
          return { ...prev, deleting: newDeleting };
        });
      }
    },
    [board]
  );

  return {
    board,
    loading,
    error,
    loadingActions,
    handleAddCard,
    handleVote,
    handleUpdateCard,
    handleDeleteCard,
  };
}
