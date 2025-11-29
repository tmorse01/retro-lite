"use client";

import { useState } from "react";
import { ThumbsUp, Edit2, Trash2, Check, X, Layers, Plus } from "lucide-react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { Card, Group, BoardPhase } from "@/types/database";

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
  groups?: Group[]; // Groups in the same column
  onCreateGroup?: (columnId: string, name: string, cardIds: string[]) => void;
  onAddCardsToGroup?: (groupId: string, cardIds: string[]) => void;
  onUngroupCard?: (cardId: string) => void;
  selectedCards?: Set<string>; // All selected cards for context
  allCards?: Card[]; // All cards in the column (for filtering selected cards)
  phase?: BoardPhase; // Current board phase
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
  groups = [],
  onCreateGroup,
  onAddCardsToGroup,
  onUngroupCard,
  selectedCards = new Set(),
  allCards = [],
  phase = "gathering",
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(card.content);
  const [author, setAuthor] = useState(card.author || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

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

  // Get groups in the same column
  const columnGroups = groups.filter((g) => g.column_id === card.column_id);
  const isInGroup = !!card.group_id;
  const currentGroup = columnGroups.find((g) => g.id === card.group_id);

  // Get selected cards in the same column (for context menu)
  const selectedCardsInColumn = Array.from(selectedCards).filter((cardId) => {
    // We'll need to check if the card is in the same column, but we don't have access to all cards here
    // So we'll just use the selectedCards set and let the parent handle column filtering
    return true;
  });

  const handleCreateNewGroup = () => {
    setShowCreateGroupDialog(true);
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

  const handleAddToGroup = (groupId: string) => {
    if (onAddCardsToGroup) {
      onAddCardsToGroup(groupId, [card.id]);
    }
  };

  const handleUngroup = () => {
    if (onUngroupCard) {
      onUngroupCard(card.id);
    }
  };

  const handleToggleSelect = () => {
    onSelectChange?.(card.id, !isSelected);
  };

  // Visual intensity based on votes
  const voteIntensity = Math.min(card.votes / 5, 1); // Normalize to 0-1, max at 5 votes

  // Determine if edit/delete are allowed (only in gathering phase)
  const canEditOrDelete = phase === "gathering";

  // Calculate if there are any actions available in the context menu
  const hasGroupingActions =
    isGroupingMode &&
    (onCreateGroup ||
      (columnGroups.length > 0 && onAddCardsToGroup) ||
      (isInGroup && onUngroupCard) ||
      (selectedCards.size > 1 && selectedCards.has(card.id) && onCreateGroup));

  const hasAnyActions = canEditOrDelete || hasGroupingActions;

  const cardContent = (
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
          </div>
        </div>
      )}
    </div>
  );

  return (
    <LoadingOverlay isLoading={isDeleting}>
      {hasAnyActions ? (
        <ContextMenu>
          <ContextMenuTrigger asChild>{cardContent}</ContextMenuTrigger>
          <ContextMenuContent>
            {canEditOrDelete && (
              <>
                <ContextMenuItem
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting || isUpdating}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Card
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </ContextMenuItem>
              </>
            )}
            {isGroupingMode && (
              <>
                {canEditOrDelete && <ContextMenuSeparator />}
                <ContextMenuItem onClick={handleToggleSelect}>
                  {isSelected ? "Deselect" : "Select"} Card
                </ContextMenuItem>
              </>
            )}
            {isGroupingMode && onCreateGroup && (
              <ContextMenuItem onClick={handleCreateNewGroup}>
                <Layers className="h-4 w-4 mr-2" />
                Create New Group
              </ContextMenuItem>
            )}
            {isGroupingMode && columnGroups.length > 0 && onAddCardsToGroup && (
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Group
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  {columnGroups.map((group) => (
                    <ContextMenuItem
                      key={group.id}
                      onClick={() => handleAddToGroup(group.id)}
                      disabled={group.id === card.group_id}
                    >
                      {group.name}
                      {group.id === card.group_id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </ContextMenuItem>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            )}
            {isGroupingMode && isInGroup && onUngroupCard && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleUngroup}>
                  <X className="h-4 w-4 mr-2" />
                  Ungroup
                </ContextMenuItem>
              </>
            )}
            {isGroupingMode &&
              selectedCards.size > 1 &&
              selectedCards.has(card.id) &&
              onCreateGroup && (
                <>
                  <ContextMenuSeparator />
                  <ContextMenuLabel>
                    {selectedCards.size} cards selected
                  </ContextMenuLabel>
                  <ContextMenuItem onClick={handleCreateNewGroup}>
                    <Layers className="h-4 w-4 mr-2" />
                    Create Group from Selection
                  </ContextMenuItem>
                </>
              )}
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        cardContent
      )}

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
    </LoadingOverlay>
  );
}
