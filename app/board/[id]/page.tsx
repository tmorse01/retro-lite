"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareBoardDialog } from "@/components/ShareBoardDialog";
import { Column } from "@/components/Column";
import type { BoardWithDetails } from "@/types/database";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  const [board, setBoard] = useState<BoardWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBoard = async () => {
      try {
        const response = await fetch(`/api/boards/${boardId}`);
        if (response.ok) {
          const data = await response.json();
          setBoard(data);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (boardId && boardId !== "demo") {
      fetchBoard();
    } else {
      setIsLoading(false);
    }
  }, [boardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading board...</div>
      </div>
    );
  }

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
              {board && (
                <h2 className="text-lg font-semibold">{board.title}</h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(true)}
              >
                Share
              </Button>
              {/* Export dropdown placeholder */}
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="container mx-auto px-4 py-8">
        {board ? (
          <div className="grid md:grid-cols-3 gap-6">
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                cards={board.cards.filter((card) => card.column_id === column.id)}
                boardId={boardId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Board not found
          </div>
        )}
      </main>

      <ShareBoardDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        boardId={boardId}
      />
    </div>
  );
}

