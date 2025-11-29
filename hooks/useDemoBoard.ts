import { useState, useCallback, useRef } from "react";
import type { BoardWithDetails, Card, Group, BoardPhase } from "@/types/database";

const LOADING_DELAY_MS = 200; // Only show spinner if operation takes longer than this

export function useDemoBoard(initialBoard: BoardWithDetails) {
  const [board, setBoard] = useState<BoardWithDetails>(initialBoard);
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

  const handleAddCard = useCallback(
    async (columnId: string, content: string, author?: string) => {
      // Optimistic update
      const newCard: Card = {
        id: `card-${Date.now()}`,
        board_id: board.id,
        column_id: columnId,
        content,
        author: author || null,
        votes: 0,
        group_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setBoard((prev) => ({
        ...prev,
        cards: [...prev.cards, newCard],
      }));

      // Clear any existing timeout
      const existingTimeout = loadingTimeouts.current.addingCard;
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set delayed loading state
      const timeoutId = setTimeout(() => {
        setLoadingActions((prev) => ({
          ...prev,
          addingCard: columnId,
        }));
      }, LOADING_DELAY_MS);
      loadingTimeouts.current.addingCard = timeoutId;

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear loading state
      clearTimeout(timeoutId);
      setLoadingActions((prev) => ({
        ...prev,
        addingCard: null,
      }));
      loadingTimeouts.current.addingCard = null;
    },
    [board.id]
  );

  const handleVote = useCallback(
    async (cardId: string) => {
      // Check if board is in voting phase
      if (board.phase !== "voting") {
        return;
      }

      // Optimistic update
      setBoard((prev) => ({
        ...prev,
        cards: prev.cards.map((card) =>
          card.id === cardId ? { ...card, votes: card.votes + 1 } : card
        ),
      }));

      // Clear any existing timeout
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

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear loading state
      clearTimeout(timeoutId);
      setLoadingActions((prev) => {
        const next = new Set(prev.voting);
        next.delete(cardId);
        return { ...prev, voting: next };
      });
      loadingTimeouts.current.voting.delete(cardId);
    },
    [board.phase]
  );

  const handleUpdateCard = useCallback(
    async (cardId: string, content: string, author?: string) => {
      // Optimistic update
      setBoard((prev) => ({
        ...prev,
        cards: prev.cards.map((card) =>
          card.id === cardId
            ? { ...card, content, author: author || null, updated_at: new Date().toISOString() }
            : card
        ),
      }));

      // Clear any existing timeout
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

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear loading state
      clearTimeout(timeoutId);
      setLoadingActions((prev) => {
        const next = new Set(prev.updating);
        next.delete(cardId);
        return { ...prev, updating: next };
      });
      loadingTimeouts.current.updating.delete(cardId);
    },
    []
  );

  const handleDeleteCard = useCallback(async (cardId: string) => {
    // Optimistic update
    setBoard((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));

    // Clear any existing timeout
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

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Clear loading state
    clearTimeout(timeoutId);
    setLoadingActions((prev) => {
      const next = new Set(prev.deleting);
      next.delete(cardId);
      return { ...prev, deleting: next };
    });
    loadingTimeouts.current.deleting.delete(cardId);
  }, []);

  const handleCreateGroup = useCallback(
    async (columnId: string, name: string, cardIds: string[]) => {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        board_id: board.id,
        column_id: columnId,
        name,
        sort_order: board.groups.length,
        created_at: new Date().toISOString(),
      };

      setBoard((prev) => ({
        ...prev,
        groups: [...prev.groups, newGroup],
        cards: prev.cards.map((card) =>
          cardIds.includes(card.id) ? { ...card, group_id: newGroup.id } : card
        ),
      }));
    },
    [board.id, board.groups.length]
  );

  const handleRenameGroup = useCallback(
    async (groupId: string, name: string) => {
      setBoard((prev) => ({
        ...prev,
        groups: prev.groups.map((group) =>
          group.id === groupId ? { ...group, name } : group
        ),
      }));
    },
    []
  );

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    setBoard((prev) => ({
      ...prev,
      groups: prev.groups.filter((group) => group.id !== groupId),
      cards: prev.cards.map((card) =>
        card.group_id === groupId ? { ...card, group_id: null } : card
      ),
    }));
  }, []);

  const handleUngroupCard = useCallback(async (cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId ? { ...card, group_id: null } : card
      ),
    }));
  }, []);

  const handleAddCardsToGroup = useCallback(
    async (groupId: string, cardIds: string[]) => {
      setBoard((prev) => ({
        ...prev,
        cards: prev.cards.map((card) =>
          cardIds.includes(card.id) ? { ...card, group_id: groupId } : card
        ),
      }));
    },
    []
  );

  const handlePhaseChange = useCallback(
    async (phase: BoardPhase) => {
      setBoard((prev) => ({
        ...prev,
        phase,
      }));
    },
    []
  );

  return {
    board,
    loading: false,
    error: null,
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
  };
}

