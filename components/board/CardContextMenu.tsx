"use client";

import { Edit2, Trash2, Layers, Plus, X, Check } from "lucide-react";
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
import type { Card } from "@/types/database";
import { useBoardContext } from "./BoardContext";

interface CardContextMenuProps {
  children: React.ReactNode;
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
  onCreateGroup?: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function CardContextMenu({
  children,
  card,
  onEdit,
  onDelete,
  onCreateGroup,
  isDeleting = false,
  isUpdating = false,
}: CardContextMenuProps) {
  const {
    phase,
    groups,
    selectedCards,
    isGroupingMode,
    onAddCardsToGroup,
    onUngroupCard,
    onSelectChange,
  } = useBoardContext();

  const canEditOrDelete = phase === "gathering";
  const columnGroups = groups.filter((g) => g.column_id === card.column_id);
  const isInGroup = !!card.group_id;

  const hasCreateGroup = !!onCreateGroup;
  const hasAddToGroup = columnGroups.length > 0 && !!onAddCardsToGroup;
  const hasUngroup = isInGroup && !!onUngroupCard;
  const hasMultiSelectGroup =
    selectedCards.size > 1 && selectedCards.has(card.id) && !!onCreateGroup;

  const hasGroupingActions =
    isGroupingMode &&
    (hasCreateGroup || hasAddToGroup || hasUngroup || hasMultiSelectGroup);

  const hasAnyActions = canEditOrDelete || hasGroupingActions;

  // Debug logging
  console.log("CardContextMenu Debug:", {
    cardId: card.id,
    phase,
    canEditOrDelete,
    isGroupingMode,
    columnGroups: columnGroups.length,
    isInGroup,
    selectedCardsSize: selectedCards.size,
    isSelected: selectedCards.has(card.id),
    hasCreateGroup,
    hasAddToGroup,
    hasUngroup,
    hasMultiSelectGroup,
    hasGroupingActions,
    hasAnyActions,
    onCreateGroup: typeof onCreateGroup,
    onAddCardsToGroup: typeof onAddCardsToGroup,
    onUngroupCard: typeof onUngroupCard,
  });

  if (!hasAnyActions) {
    console.log(
      "CardContextMenu: No actions available, returning children only"
    );
    return <>{children}</>;
  }

  console.log("CardContextMenu: Rendering context menu");

  const handleToggleSelect = () => {
    onSelectChange?.(card.id, !selectedCards.has(card.id));
  };

  const handleCreateNewGroup = () => {
    onCreateGroup?.();
  };

  const handleAddToGroup = (groupId: string) => {
    onAddCardsToGroup?.(groupId, [card.id]);
  };

  const handleUngroup = () => {
    onUngroupCard?.(card.id);
  };

  return (
    <ContextMenu
      onOpenChange={(open) => {
        console.log("ContextMenu: onOpenChange", open, card.id);
      }}
    >
      <ContextMenuTrigger asChild>
        <div style={{ display: "contents" }}>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent
        onCloseAutoFocus={(e) => {
          console.log("ContextMenuContent: Menu closed", e);
        }}
      >
        {(() => {
          const itemCount = [
            canEditOrDelete,
            isGroupingMode,
            isGroupingMode && !!onCreateGroup,
          ].filter(Boolean).length;
          console.log("Rendering menu items:", {
            canEditOrDelete,
            isGroupingMode,
            onCreateGroup: !!onCreateGroup,
            showSelect: isGroupingMode,
            showCreateGroup: isGroupingMode && !!onCreateGroup,
            itemCount,
          });
          if (itemCount === 0) {
            console.warn("WARNING: No menu items will render!");
          }
          return null;
        })()}
        {canEditOrDelete && (
          <>
            <ContextMenuItem
              onClick={onEdit}
              disabled={isDeleting || isUpdating}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Card
            </ContextMenuItem>
            <ContextMenuItem
              onClick={onDelete}
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
              {selectedCards.has(card.id) ? "Deselect" : "Select"} Card
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
  );
}
