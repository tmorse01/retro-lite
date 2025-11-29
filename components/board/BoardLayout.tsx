"use client";

import Link from "next/link";
import { Share2, Download, Layers, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShareBoardDialog } from "./ShareBoardDialog";
import { PhaseIndicator } from "./PhaseIndicator";
import { useState } from "react";
import type { BoardPhase } from "@/types/database";

interface BoardLayoutProps {
  boardTitle: string;
  boardId: string;
  children: React.ReactNode;
  phase?: BoardPhase;
  onPhaseChange?: (phase: BoardPhase) => void;
  isGroupingMode?: boolean;
  selectedCards?: Set<string>;
  onCreateGroup?: (name: string) => void;
  onClearSelection?: () => void;
  board?: { cards: Array<{ id: string; column_id: string }> };
}

export function BoardLayout({
  boardTitle,
  boardId,
  children,
  phase = "gathering",
  onPhaseChange,
  isGroupingMode = false,
  selectedCards = new Set(),
  onCreateGroup,
  onClearSelection,
}: BoardLayoutProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality coming soon!");
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && onCreateGroup) {
      onCreateGroup(groupName.trim());
      setGroupName("");
      setCreateGroupDialogOpen(false);
      onClearSelection?.();
    }
  };

  const selectedCount = selectedCards.size;
  const hasSelection = selectedCount > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Board Title + Phase */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                RetroLite
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold truncate">{boardTitle}</h1>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <PhaseIndicator
                phase={phase}
                onPhaseChange={onPhaseChange}
                showControls={true}
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {isGroupingMode && hasSelection && (
                <>
                  <Badge variant="secondary" className="mr-2">
                    {selectedCount} selected
                  </Badge>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setCreateGroupDialogOpen(true);
                    }}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClearSelection?.();
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </>
              )}
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

      <Dialog
        open={createGroupDialogOpen}
        onOpenChange={setCreateGroupDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Enter a name for the group containing {selectedCount} selected
              card{selectedCount !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Group name (e.g., CI/CD Issues)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && groupName.trim()) {
                  handleCreateGroup();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateGroupDialogOpen(false);
                setGroupName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={!groupName.trim()}>
              <Check className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
