"use client";

import { useState } from "react";
import { ThumbsUp, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { LoadingOverlay } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  isGroupingMode?: boolean;
  isSelected?: boolean;
  onSelectChange?: (cardId: string, selected: boolean) => void;
  isVotingPhase?: boolean;
}

export function CardItem({
  card,
  onVote,
  onUpdate,
  onDelete,
  isVoting = false,
  isUpdating = false,
  isDeleting = false,
  isGroupingMode = false,
  isSelected = false,
  onSelectChange,
  isVotingPhase = false,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.content);
  const [author, setAuthor] = useState(card.author || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onUpdate(card.id, content, author || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(card.content);
    setAuthor(card.author || "");
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(card.id);
    setShowDeleteConfirm(false);
  };

  // Visual intensity based on votes
  const voteIntensity = Math.min(card.votes / 5, 1); // Normalize to 0-1, max at 5 votes

  return (
    <LoadingOverlay isLoading={isDeleting}>
      <div
        className={cn(
          "group relative bg-white rounded-lg border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 m-2",
          voteIntensity > 0.5 && "border-primary/50 bg-primary/5",
          voteIntensity > 0.8 && "border-primary bg-primary/10",
          isDeleting && "opacity-50",
          isGroupingMode && isSelected && "ring-2 ring-primary",
          isGroupingMode && "pl-10"
        )}
      >
        {isGroupingMode && (
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelectChange?.(card.id, checked === true)
              }
            />
          </div>
        )}
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
              {isVotingPhase ? (
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
              ) : (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {card.votes}
                  </Badge>
                </div>
              )}
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
                  onClick={handleDeleteClick}
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

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this card? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted rounded-lg p-3 border">
              <p className="text-sm text-foreground">{card.content}</p>
              {card.author && (
                <p className="text-xs text-muted-foreground mt-1">
                  — {card.author}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LoadingOverlay>
  );
}
