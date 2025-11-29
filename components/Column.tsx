"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardItem } from "@/components/CardItem";
import { EmptyState } from "@/components/EmptyState";
import type { Column as ColumnType, Card } from "@/types/database";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  boardId: string;
  onAddCard?: (columnId: string, content: string, author?: string) => void;
  onUpdateCard?: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard?: (cardId: string) => void;
  onVote?: (cardId: string) => void;
}

export function Column({
  column,
  cards,
  boardId,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onVote,
}: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState("");
  const [newCardAuthor, setNewCardAuthor] = useState("");

  const handleAddCard = async () => {
    if (!newCardContent.trim()) return;

    if (onAddCard) {
      onAddCard(column.id, newCardContent.trim(), newCardAuthor.trim() || undefined);
    } else {
      // TODO: API call for real boards
      try {
        await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boardId,
            columnId: column.id,
            content: newCardContent.trim(),
            author: newCardAuthor.trim() || undefined,
          }),
        });
      } catch (error) {
        console.error("Failed to add card:", error);
      }
    }

    setNewCardContent("");
    setNewCardAuthor("");
    setIsAddingCard(false);
  };

  const totalVotes = cards.reduce((sum, card) => sum + card.votes, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{column.title}</h3>
          <Badge variant="secondary">{cards.length}</Badge>
          {totalVotes > 0 && (
            <Badge variant="outline">{totalVotes} votes</Badge>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-4 min-h-[200px]">
        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
              onVote={onVote}
            />
          ))
        )}
      </div>

      {isAddingCard ? (
        <div className="space-y-2 border-t pt-4">
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="Enter feedback..."
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
            rows={3}
            autoFocus
          />
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Your name (optional)"
            value={newCardAuthor}
            onChange={(e) => setNewCardAuthor(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddCard} className="flex-1">
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingCard(false);
                setNewCardContent("");
                setNewCardAuthor("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAddingCard(true)}
        >
          + Add card
        </Button>
      )}
    </div>
  );
}

