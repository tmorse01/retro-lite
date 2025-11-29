"use client";

import { useState } from "react";
import { ThumbsUp, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Card } from "@/types/database";

interface CardItemProps {
  card: Card;
  onUpdate?: (cardId: string, updates: Partial<Card>) => void;
  onDelete?: (cardId: string) => void;
  onVote?: (cardId: string) => void;
}

export function CardItem({ card, onUpdate, onDelete, onVote }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    if (onUpdate) {
      onUpdate(card.id, { content: editContent.trim() });
    } else {
      // TODO: API call for real boards
      try {
        await fetch(`/api/cards/${card.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent.trim() }),
        });
      } catch (error) {
        console.error("Failed to update card:", error);
      }
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(card.id);
    } else {
      // TODO: API call for real boards
      try {
        await fetch(`/api/cards/${card.id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete card:", error);
      }
    }
  };

  const handleVote = async () => {
    if (onVote) {
      onVote(card.id);
    } else {
      // TODO: API call for real boards
      try {
        await fetch(`/api/cards/${card.id}/vote`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to vote:", error);
      }
    }
  };

  const voteIntensity = Math.min(card.votes / 5, 1); // Normalize to 0-1
  const bgIntensity = voteIntensity * 0.1; // Subtle background tint

  return (
    <div
      className={`bg-white border rounded-lg p-3 transition-all hover:shadow-md hover:-translate-y-0.5 relative group ${
        card.votes > 0 ? "border-primary/20" : ""
      }`}
      style={{
        backgroundColor: card.votes > 0
          ? `rgba(59, 130, 246, ${bgIntensity})`
          : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm resize-none"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate} className="flex-1">
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditContent(card.content);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm mb-2">{card.content}</p>
          {card.author && (
            <p className="text-xs text-muted-foreground mb-2">— {card.author}</p>
          )}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVote}
              className="h-8 px-2"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <Badge variant={card.votes > 0 ? "default" : "outline"}>
                {card.votes}
              </Badge>
            </Button>
            {(isHovered || isEditing) && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

