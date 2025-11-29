"use client";

import { useRef } from "react";
import { LoadingOverlay } from "@/components/ui/spinner";
import { CardContent, type CardContentRef } from "./CardContent";
import { CardContextMenu } from "./CardContextMenu";
import { CardDialogs, type CardDialogsRef } from "./CardDialogs";
import { useBoardContext } from "./BoardContext";
import type { Card, BoardPhase } from "@/types/database";

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
  const { phase, isGroupingMode, selectedCards, onSelectChange } =
    useBoardContext();

  const contentRef = useRef<CardContentRef>(null);
  const dialogsRef = useRef<CardDialogsRef>(null);

  const handleEdit = () => {
    contentRef.current?.startEditing();
  };

  const handleDelete = () => {
    dialogsRef.current?.showDeleteDialog();
  };

  const handleCreateGroup = () => {
    dialogsRef.current?.showCreateGroupDialog();
  };

  const isSelected = selectedCards.has(card.id);

  return (
    <LoadingOverlay isLoading={isDeleting}>
      <CardContextMenu
        card={card}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateGroup={handleCreateGroup}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      >
        <CardContent
          ref={contentRef}
          card={card}
          onVote={onVote}
          onUpdate={onUpdate}
          phase={phase}
          isVoting={isVoting}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          isGroupingMode={isGroupingMode}
          isSelected={isSelected}
          onSelectChange={onSelectChange}
        />
      </CardContextMenu>

      <CardDialogs
        ref={dialogsRef}
        card={card}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </LoadingOverlay>
  );
}
