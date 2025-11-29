import { supabase } from "./client";
import type { Card, Board, Group } from "@/types/database";

/**
 * Subscribe to realtime changes for cards in a board
 * @param boardId The board ID to subscribe to
 * @param onInsert Callback when a card is inserted
 * @param onUpdate Callback when a card is updated
 * @param onDelete Callback when a card is deleted
 * @param onBoardUpdate Optional callback when the board itself is updated (e.g., phase change)
 * @returns A function to unsubscribe
 */
export function subscribeToBoardCards(
  boardId: string,
  onInsert: (card: Card) => void,
  onUpdate: (card: Card) => void,
  onDelete: (cardId: string) => void,
  onBoardUpdate?: (board: Board) => void
) {
  const channel = supabase
    .channel(`board:${boardId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "cards",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onInsert(payload.new as Card);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cards",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onUpdate(payload.new as Card);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "cards",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onDelete(payload.old.id);
      }
    );

  // Subscribe to board updates (e.g., phase changes)
  if (onBoardUpdate) {
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "boards",
        filter: `id=eq.${boardId}`,
      },
      (payload) => {
        onBoardUpdate(payload.new as Board);
      }
    );
  }

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to realtime changes for groups in a board
 * @param boardId The board ID to subscribe to
 * @param onInsert Callback when a group is inserted
 * @param onUpdate Callback when a group is updated
 * @param onDelete Callback when a group is deleted
 * @returns A function to unsubscribe
 */
export function subscribeToBoardGroups(
  boardId: string,
  onInsert: (group: Group) => void,
  onUpdate: (group: Group) => void,
  onDelete: (groupId: string) => void
) {
  const channel = supabase
    .channel(`board-groups:${boardId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "groups",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onInsert(payload.new as Group);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "groups",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onUpdate(payload.new as Group);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "groups",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        onDelete(payload.old.id);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
