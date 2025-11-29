"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CardVoteButton } from "./CardVoteButton";
import type { Card, BoardPhase } from "@/types/database";

interface CardContentProps {
  card: Card;
  onVote: (cardId: string) => void;
  onUpdate: (cardId: string, content: string, author?: string) => void;
  phase: BoardPhase;
  isVoting?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isGroupingMode?: boolean;
  isSelected?: boolean;
  onSelectChange?: (cardId: string, selected: boolean) => void;
}

export interface CardContentRef {
  startEditing: () => void;
}

export const CardContent = forwardRef<CardContentRef, CardContentProps>(
  function CardContent(
    {
      card,
      onVote,
      onUpdate,
      phase,
      isVoting = false,
      isUpdating = false,
      isDeleting = false,
      isGroupingMode = false,
      isSelected = false,
      onSelectChange,
    },
    ref
  ) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(card.content);
    const [author, setAuthor] = useState(card.author || "");

    // Reset form when card changes
    useEffect(() => {
      setContent(card.content);
      setAuthor(card.author || "");
    }, [card.content, card.author]);

    useImperativeHandle(ref, () => ({
      startEditing: () => setIsEditing(true),
    }));

    const handleSave = () => {
      onUpdate(card.id, content, author || undefined);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setContent(card.content);
      setAuthor(card.author || "");
      setIsEditing(false);
    };

  // Visual intensity based on votes
  const voteIntensity = Math.min(card.votes / 5, 1);

  return (
    <div
      className={cn(
        "group relative bg-card rounded-lg border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 m-2",
        voteIntensity > 0.5 && "border-primary/50 bg-primary/5",
        voteIntensity > 0.8 && "border-primary bg-primary/10",
        isDeleting && "opacity-50",
        isGroupingMode && isSelected && "ring-2 ring-primary",
        isGroupingMode && "flex items-center gap-3"
      )}
    >
      {isGroupingMode && (
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelectChange?.(card.id, checked === true)
            }
          />
        </div>
      )}
      {isEditing ? (
        <div className={cn("space-y-3", isGroupingMode && "flex-1")}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none"
            autoFocus
          />
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Spinner size="sm" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className={cn(isGroupingMode && "flex-1")}>
          <p className="text-sm text-foreground mb-2">{card.content}</p>
          {card.author && (
            <p className="text-xs text-muted-foreground mb-3">
              — {card.author}
            </p>
          )}
          <div className="flex items-center justify-between">
            <CardVoteButton
              card={card}
              onVote={onVote}
              phase={phase}
              isVoting={isVoting}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      )}
    </div>
  );
  }
);

