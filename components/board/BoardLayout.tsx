"use client";

import Link from "next/link";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ShareBoardDialog } from "./ShareBoardDialog";
import { useState } from "react";

interface BoardLayoutProps {
  boardTitle: string;
  boardId: string;
  children: React.ReactNode;
}

export function BoardLayout({
  boardTitle,
  boardId,
  children,
}: BoardLayoutProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Board Title */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                RetroLite
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold truncate">{boardTitle}</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                }
              >
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
