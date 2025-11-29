"use client";

import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Lightbulb,
  Group,
  Vote,
  CheckCircle2,
} from "lucide-react";
import type { BoardPhase } from "@/types/database";

interface PhaseIndicatorProps {
  phase: BoardPhase;
  onPhaseChange?: (phase: BoardPhase) => void;
  showControls?: boolean;
}

const phaseConfig: Record<
  BoardPhase,
  { label: string; description: string; icon: React.ReactNode; color: string }
> = {
  gathering: {
    label: "Gathering",
    description: "Gathering ideas...",
    icon: <Lightbulb className="h-3 w-3" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  grouping: {
    label: "Grouping",
    description: "Grouping related items...",
    icon: <Group className="h-3 w-3" />,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  voting: {
    label: "Voting",
    description: "Voting on priorities...",
    icon: <Vote className="h-3 w-3" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  actions: {
    label: "Actions",
    description: "Defining action items...",
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

const phaseOrder: BoardPhase[] = ["gathering", "grouping", "voting", "actions"];

export function PhaseIndicator({
  phase,
  onPhaseChange,
  showControls = false,
}: PhaseIndicatorProps) {
  const config = phaseConfig[phase];
  const currentIndex = phaseOrder.indexOf(phase);
  const nextPhase = phaseOrder[currentIndex + 1];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1.5 font-medium`}
      >
        {config.icon}
        <span>{config.label}</span>
      </Badge>
      <span className="text-sm text-muted-foreground hidden sm:inline">
        {config.description}
      </span>
      {showControls && nextPhase && onPhaseChange && (
        <button
          onClick={() => onPhaseChange(nextPhase)}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          title={`Advance to ${phaseConfig[nextPhase].label} phase`}
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
