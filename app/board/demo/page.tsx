"use client";

import { useState } from "react";
import { BoardLayout } from "@/components/board/BoardLayout";
import { Column } from "@/components/board/Column";
import type { Card, Column as ColumnType } from "@/types/database";

// Mock data for demo board
const mockColumns: ColumnType[] = [
  {
    id: "col-1",
    board_id: "demo",
    title: "Went Well",
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col-2",
    board_id: "demo",
    title: "Needs Improvement",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col-3",
    board_id: "demo",
    title: "Action Items",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialCards: Card[] = [
  {
    id: "card-1",
    board_id: "demo",
    column_id: "col-1",
    content: "Great collaboration with the design team.",
    author: "Alice",
    votes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-2",
    board_id: "demo",
    column_id: "col-1",
    content: "CI pipeline is much faster now.",
    author: "Bob",
    votes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-3",
    board_id: "demo",
    column_id: "col-2",
    content: "Too many last-minute scope changes.",
    author: "Charlie",
    votes: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-4",
    board_id: "demo",
    column_id: "col-2",
    content: "We need clearer acceptance criteria.",
    author: "Diana",
    votes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-5",
    board_id: "demo",
    column_id: "col-3",
    content: "Define 'ready for development' checklist.",
    author: "Eve",
    votes: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-6",
    board_id: "demo",
    column_id: "col-3",
    content: "Schedule weekly sync with product.",
    author: "Frank",
    votes: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DemoBoardPage() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleAddCard = (
    columnId: string,
    content: string,
    author?: string
  ) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      board_id: "demo",
      column_id: columnId,
      content,
      author: author || null,
      votes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCards([...cards, newCard]);
  };

  const handleVote = (cardId: string) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, votes: card.votes + 1 } : card
      )
    );
  };

  const handleUpdateCard = (
    cardId: string,
    content: string,
    author?: string
  ) => {
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? { ...card, content, author: author || null }
          : card
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const getCardsForColumn = (columnId: string): Card[] => {
    return cards
      .filter((card) => card.column_id === columnId)
      .sort((a, b) => b.votes - a.votes);
  };

  return (
    <BoardLayout boardTitle="Demo Retro Board" boardId="demo">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={getCardsForColumn(column.id)}
            onAddCard={handleAddCard}
            onVote={handleVote}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </div>
    </BoardLayout>
  );
}

