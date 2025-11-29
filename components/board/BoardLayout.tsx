"use client";

import Link from "next/link";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareBoardDialog } from "./ShareBoardDialog";
import { PhaseIndicator } from "./PhaseIndicator";
import { useState } from "react";
import type { BoardPhase } from "@/types/database";

interface BoardLayoutProps {
  boardTitle: string;
  boardId: string;
  phase: BoardPhase;
  onPhaseChange?: (phase: BoardPhase) => void;
  children: React.ReactNode;
}

export function BoardLayout({
  boardTitle,
  boardId,
  phase,
  onPhaseChange,
  children,
}: BoardLayoutProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality coming soon!");
  };

  const handlePhaseChange = async (newPhase: BoardPhase) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: newPhase }),
      });

      if (response.ok && onPhaseChange) {
        onPhaseChange(newPhase);
      } else {
        console.error("Failed to update phase");
      }
    } catch (error) {
      console.error("Error updating phase:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Board Title + Phase */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link href="/" className="text-xl font-bold text-primary shrink-0">
                RetroLite
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border shrink-0" />
              <h1 className="text-lg font-semibold truncate">{boardTitle}</h1>
              <div className="hidden md:flex items-center gap-4 ml-auto">
                <PhaseIndicator
                  phase={phase}
                  onPhaseChange={handlePhaseChange}
                  showControls={true}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile phase indicator */}
              <div className="md:hidden">
                <PhaseIndicator phase={phase} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExport}>
                    Export as Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <ShareBoardDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        boardId={boardId}
      />
    </div>
  );
}
