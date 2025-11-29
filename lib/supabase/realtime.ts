import { supabase } from "./client";
import type { Card } from "@/types/database";

/**
 * Subscribe to realtime changes for cards in a board
 * @param boardId The board ID to subscribe to
 * @param onInsert Callback when a card is inserted
 * @param onUpdate Callback when a card is updated
 * @param onDelete Callback when a card is deleted
 * @returns A function to unsubscribe
 */
export function subscribeToBoardCards(
  boardId: string,
  onInsert: (card: Card) => void,
  onUpdate: (card: Card) => void,
  onDelete: (cardId: string) => void
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
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

