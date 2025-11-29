"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardItem } from "./CardItem";
import type { Card, Group as GroupType } from "@/types/database";
import { cn } from "@/lib/utils";

interface GroupProps {
  group: GroupType;
  cards: Card[];
  allColumnCards?: Card[]; // All cards in the column (for filtering selected cards)
  onVote: (cardId: string) => void;
  onUpdateCard: (cardId: string, content: string, author?: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameGroup: (groupId: string, name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onUngroupCard: (cardId: string) => void;
  onAddCardsToGroup?: (groupId: string, cardIds: string[]) => void;
  isGroupingMode?: boolean;
  selectedCards?: Set<string>;
  onSelectChange?: (cardId: string, selected: boolean) => void;
  votingCards?: Set<string>;
  updatingCards?: Set<string>;
  deletingCards?: Set<string>;
  isVotingPhase?: boolean;
}

export function Group({
  group,
  cards,
  allColumnCards = [],
  onVote,
  onUpdateCard,
  onDeleteCard,
  onRenameGroup,
  onDeleteGroup,
  onUngroupCard,
  onAddCardsToGroup,
  isGroupingMode = false,
  selectedCards = new Set(),
  onSelectChange,
  votingCards = new Set(),
  updatingCards = new Set(),
  deletingCards = new Set(),
  isVotingPhase = false,
}: GroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(group.name);

  const totalVotes = cards.reduce((sum, card) => sum + card.votes, 0);

  // Get selected cards that are in the same column as this group
  // Only include cards that are in the same column and not already in this group
  const selectedCardsInColumn = Array.from(selectedCards).filter((cardId) => {
    const card = allColumnCards.find((c) => c.id === cardId);
    if (!card) return false;
    // Card must be in the same column as the group
    if (card.column_id !== group.column_id) return false;
    // Card should not already be in this group
    if (card.group_id === group.id) return false;
    return true;
  });

  const hasSelectedCards = selectedCardsInColumn.length > 0;

  const handleAddSelectedCards = () => {
    if (onAddCardsToGroup && hasSelectedCards) {
      onAddCardsToGroup(group.id, selectedCardsInColumn);
      // Clear selection for the cards that were added
      selectedCardsInColumn.forEach((cardId) => {
        onSelectChange?.(cardId, false);
      });
    }
  };

  const handleRename = () => {
    if (renameValue.trim() && renameValue.trim() !== group.name) {
      onRenameGroup(group.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setRenameValue(group.name);
    setIsRenaming(false);
  };

  return (
    <div className="group border rounded-lg bg-muted/30">
      {/* Group Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          {isRenaming ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") handleCancelRename();
                }}
                className="h-7 text-sm flex-1"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleRename}>
                <ChevronDown className="h-4 w-4 rotate-180" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelRename}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-sm truncate flex-1">
                {group.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {cards.length}
              </Badge>
              {totalVotes > 0 && (
                <Badge variant="outline" className="text-xs">
                  {totalVotes} votes
                </Badge>
              )}
            </>
          )}
        </div>
        {!isRenaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isGroupingMode && hasSelectedCards && onAddCardsToGroup && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs mr-1"
                onClick={handleAddSelectedCards}
                title={`Add ${selectedCardsInColumn.length} selected card${
                  selectedCardsInColumn.length !== 1 ? "s" : ""
                } to this group`}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add {selectedCardsInColumn.length}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsRenaming(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onDeleteGroup(group.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Group Cards */}
      {!isCollapsed && (
        <div className="p-2 space-y-2">
          {cards.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No cards in this group
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="relative">
                <CardItem
                  card={card}
                  onVote={onVote}
                  onUpdate={onUpdateCard}
                  onDelete={onDeleteCard}
                  isVoting={votingCards.has(card.id)}
                  isUpdating={updatingCards.has(card.id)}
                  isDeleting={deletingCards.has(card.id)}
                  isGroupingMode={isGroupingMode}
                  isSelected={selectedCards.has(card.id)}
                  onSelectChange={onSelectChange}
                  isVotingPhase={isVotingPhase}
                />
                {isGroupingMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 text-xs"
                    onClick={() => onUngroupCard(card.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Ungroup
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
