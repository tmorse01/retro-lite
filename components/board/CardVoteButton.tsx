"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { Card, BoardPhase } from "@/types/database";

interface CardVoteButtonProps {
  card: Card;
  onVote: (cardId: string) => void;
  phase: BoardPhase;
  isVoting?: boolean;
  isDeleting?: boolean;
}

export function CardVoteButton({
  card,
  onVote,
  phase,
  isVoting = false,
  isDeleting = false,
}: CardVoteButtonProps) {
  const isVotingPhase = phase === "voting";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onVote(card.id)}
      className="h-8"
      disabled={!isVotingPhase || isVoting || isDeleting}
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
  );
}
