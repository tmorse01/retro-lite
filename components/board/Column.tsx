"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CardItem } from "./CardItem";
import { Group } from "./Group";
import type {
  Card,
  Column as ColumnType,
  Group as GroupType,
  BoardPhase,
} from "@/types/database";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  groups: GroupType[];
  onAddCard: (columnId: string, content: string, author?: string) => void;
  onVote: (cardId: string) => void;
  onUpdateCard: (cardId: string, content: string, author?: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameGroup?: (groupId: string, name: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onUngroupCard?: (cardId: string) => void;
  onAddCardsToGroup?: (groupId: string, cardIds: string[]) => void;
  onCreateGroup?: (columnId: string, name: string, cardIds: string[]) => void;
  isAddingCard?: boolean;
  votingCards?: Set<string>;
  updatingCards?: Set<string>;
  deletingCards?: Set<string>;
}

export function Column({
  column,
  cards,
  groups = [],
  onAddCard,
  onVote,
  onUpdateCard,
  onDeleteCard,
  onRenameGroup,
  onDeleteGroup,
  onUngroupCard,
  onAddCardsToGroup,
  onCreateGroup,
  isAddingCard = false,
  votingCards = new Set(),
  updatingCards = new Set(),
  deletingCards = new Set(),
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

  // Separate cards into grouped and ungrouped
  const groupedCardIds = new Set(
    groups.flatMap((group) =>
      cards.filter((card) => card.group_id === group.id).map((card) => card.id)
    )
  );
  const ungroupedCards = cards.filter(
    (card) => !card.group_id || !groupedCardIds.has(card.id)
  );
  const columnGroups = groups
    .filter((group) => group.column_id === column.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border p-4">
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

      {/* Groups and Cards List */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pt-2">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No items yet. Add the first card.
          </div>
        ) : (
          <>
            {/* Display Groups */}
            {columnGroups.map((group) => {
              const groupCards = cards.filter(
                (card) => card.group_id === group.id
              );
              return (
                <Group
                  key={group.id}
                  group={group}
                  cards={groupCards}
                  allColumnCards={cards}
                  allColumnGroups={columnGroups}
                  onVote={onVote}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={onDeleteCard}
                  onRenameGroup={onRenameGroup || (() => {})}
                  onDeleteGroup={onDeleteGroup || (() => {})}
                  onUngroupCard={onUngroupCard || (() => {})}
                  onAddCardsToGroup={onAddCardsToGroup}
                  onCreateGroup={onCreateGroup}
                  votingCards={votingCards}
                  updatingCards={updatingCards}
                  deletingCards={deletingCards}
                />
              );
            })}

            {/* Display Ungrouped Cards */}
            {ungroupedCards.length > 0 && (
              <div className="space-y-3">
                {ungroupedCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onVote={onVote}
                    onUpdate={onUpdateCard}
                    onDelete={onDeleteCard}
                    isVoting={votingCards.has(card.id)}
                    isUpdating={updatingCards.has(card.id)}
                    isDeleting={deletingCards.has(card.id)}
                  />
                ))}
              </div>
            )}
          </>
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
            <Button
              size="sm"
              onClick={handleAdd}
              className="flex-1"
              disabled={isAddingCard}
            >
              {isAddingCard ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isAddingCard}
            >
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
