"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ShareBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
}

export function ShareBoardDialog({
  open,
  onOpenChange,
  boardId,
}: ShareBoardDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/board/${boardId}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with your team.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
          <DialogDescription>
            Share this link with your team to collaborate on the retro board.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button onClick={handleCopy} variant="outline">
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

