"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardItem } from "./CardItem";
import type { Card, Column as ColumnType } from "@/types/database";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onAddCard: (columnId: string, content: string, author?: string) => void;
  onVote: (cardId: string) => void;
  onUpdateCard: (cardId: string, content: string, author?: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export function Column({
  column,
  cards,
  onAddCard,
  onVote,
  onUpdateCard,
  onDeleteCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleAdd = () => {
    if (content.trim()) {
      onAddCard(column.id, content.trim(), author.trim() || undefined);
      setContent("");
      setAuthor("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setAuthor("");
    setIsAdding(false);
  };

  const totalVotes = cards.reduce((sum, card) => sum + card.votes, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{column.title}</h2>
          <Badge variant="secondary">{cards.length}</Badge>
          {totalVotes > 0 && (
            <Badge variant="outline" className="text-xs">
              {totalVotes} votes
            </Badge>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No items yet. Add the first card.
          </div>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onVote={onVote}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
            />
          ))
        )}
      </div>

      {/* Add Card */}
      {isAdding ? (
        <div className="mt-4 space-y-2 border-t pt-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What went well?"
            className="min-h-[80px] resize-none"
            autoFocus
          />
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="flex-1">
              Add Card
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      )}
    </div>
  );
}

