"use client";

import { useState } from "react";
import { ThumbsUp, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { LoadingOverlay } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/database";

interface CardItemProps {
  card: Card;
  onVote: (cardId: string) => void;
  onUpdate: (cardId: string, content: string, author?: string) => void;
  onDelete: (cardId: string) => void;
  isVoting?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CardItem({
  card,
  onVote,
  onUpdate,
  onDelete,
  isVoting = false,
  isUpdating = false,
  isDeleting = false,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.content);
  const [author, setAuthor] = useState(card.author || "");

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
  const voteIntensity = Math.min(card.votes / 5, 1); // Normalize to 0-1, max at 5 votes

  return (
    <LoadingOverlay isLoading={isDeleting}>
      <div
        className={cn(
          "group relative bg-white rounded-lg border p-4 transition-all hover:shadow-md hover:-translate-y-0.5",
          voteIntensity > 0.5 && "border-primary/50 bg-primary/5",
          voteIntensity > 0.8 && "border-primary bg-primary/10",
          isDeleting && "opacity-50"
        )}
      >
        {isEditing ? (
          <div className="space-y-3">
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
          <>
            <p className="text-sm text-foreground mb-2">{card.content}</p>
            {card.author && (
              <p className="text-xs text-muted-foreground mb-3">
                — {card.author}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(card.id)}
                className="h-8"
                disabled={isVoting || isDeleting}
              >
                {isVoting ? (
                  <>
                    <Spinner size="sm" className="mr-1" />
                    <Badge variant="secondary" className="ml-1">
                      {card.votes}
                    </Badge>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <Badge variant="secondary" className="ml-1">
                      {card.votes}
                    </Badge>
                  </>
                )}
              </Button>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting || isUpdating}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(card.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </LoadingOverlay>
  );
}
