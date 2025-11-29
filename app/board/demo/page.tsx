"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareBoardDialog } from "@/components/ShareBoardDialog";
import { Column } from "@/components/Column";
import type { Card } from "@/types/database";

const DEMO_COLUMNS = [
  { id: "col-1", title: "Went Well", sort_order: 0 },
  { id: "col-2", title: "Needs Improvement", sort_order: 1 },
  { id: "col-3", title: "Action Items", sort_order: 2 },
];

const DEMO_CARDS: Card[] = [
  {
    id: "card-1",
    board_id: "demo",
    column_id: "col-1",
    content: "Great collaboration with the design team.",
    author: null,
    votes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-2",
    board_id: "demo",
    column_id: "col-1",
    content: "CI pipeline is much faster now.",
    author: null,
    votes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-3",
    board_id: "demo",
    column_id: "col-2",
    content: "Too many last-minute scope changes.",
    author: null,
    votes: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-4",
    board_id: "demo",
    column_id: "col-2",
    content: "We need clearer acceptance criteria.",
    author: null,
    votes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-5",
    board_id: "demo",
    column_id: "col-3",
    content: "Define 'ready for development' checklist.",
    author: null,
    votes: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-6",
    board_id: "demo",
    column_id: "col-3",
    content: "Schedule weekly sync with product.",
    author: null,
    votes: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DemoBoardPage() {
  const [cards, setCards] = useState<Card[]>(DEMO_CARDS);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleAddCard = (columnId: string, content: string, author?: string) => {
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

  const handleUpdateCard = (cardId: string, updates: Partial<Card>) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleVote = (cardId: string) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, votes: card.votes + 1 } : card
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* App Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                RetroLite
              </Link>
              <h2 className="text-lg font-semibold">Demo Board - Sprint 42</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(true)}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {DEMO_COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={cards.filter((card) => card.column_id === column.id)}
              boardId="demo"
              onAddCard={handleAddCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
              onVote={handleVote}
            />
          ))}
        </div>
      </main>

      <ShareBoardDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        boardId="demo"
      />
    </div>
  );
}

