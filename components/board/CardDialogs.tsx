"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Card } from "@/types/database";
import { useBoardContext } from "./BoardContext";

interface CardDialogsProps {
  card: Card;
  onDelete: (cardId: string) => void;
  isDeleting?: boolean;
}

export interface CardDialogsRef {
  showDeleteDialog: () => void;
  showCreateGroupDialog: () => void;
}

export const CardDialogs = forwardRef<CardDialogsRef, CardDialogsProps>(
  function CardDialogs({ card, onDelete, isDeleting = false }, ref) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const { selectedCards, allCards, onCreateGroup } = useBoardContext();

    useImperativeHandle(ref, () => ({
      showDeleteDialog: () => setShowDeleteConfirm(true),
      showCreateGroupDialog: () => setShowCreateGroupDialog(true),
    }));

    const handleDeleteConfirm = () => {
    onDelete(card.id);
    setShowDeleteConfirm(false);
  };

  const handleConfirmCreateGroup = () => {
    if (newGroupName.trim() && onCreateGroup) {
      // Include this card and any other selected cards in the same column
      let cardIdsToGroup = [card.id];

      // If multiple cards are selected, filter to only those in the same column
      if (selectedCards.size > 1 && selectedCards.has(card.id)) {
        const selectedCardsInColumn = Array.from(selectedCards).filter(
          (cardId) => {
            const selectedCard = allCards.find((c) => c.id === cardId);
            return selectedCard && selectedCard.column_id === card.column_id;
          }
        );
        if (selectedCardsInColumn.length > 0) {
          cardIdsToGroup = selectedCardsInColumn;
        }
      }

      onCreateGroup(card.column_id, newGroupName.trim(), cardIdsToGroup);
      setNewGroupName("");
      setShowCreateGroupDialog(false);
    }
  };

  return (
    <>
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

      <Dialog
        open={showCreateGroupDialog}
        onOpenChange={setShowCreateGroupDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Enter a name for the new group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Group name (e.g., CI/CD Issues)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newGroupName.trim()) {
                  handleConfirmCreateGroup();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateGroupDialog(false);
                setNewGroupName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCreateGroup}
              disabled={!newGroupName.trim()}
            >
              <Check className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
  }
);

