"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Group, Vote, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BoardPhase } from "@/types/database";

interface PhaseIndicatorProps {
  phase: BoardPhase;
  onPhaseChange?: (phase: BoardPhase) => void;
  showControls?: boolean;
}

const phaseConfig: Record<
  BoardPhase,
  {
    label: string;
    description: string;
    icon: React.ReactNode;
    activeColor: string;
    inactiveColor: string;
  }
> = {
  gathering: {
    label: "Gathering",
    description: "Gathering ideas...",
    icon: <Lightbulb className="h-3.5 w-3.5" />,
    activeColor: "bg-blue-100 text-blue-800 border-blue-300",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-blue-50 hover:text-blue-700",
  },
  grouping: {
    label: "Grouping",
    description: "Grouping related items...",
    icon: <Group className="h-3.5 w-3.5" />,
    activeColor: "bg-purple-100 text-purple-800 border-purple-300",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-purple-50 hover:text-purple-700",
  },
  voting: {
    label: "Voting",
    description: "Voting on priorities...",
    icon: <Vote className="h-3.5 w-3.5" />,
    activeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-yellow-50 hover:text-yellow-700",
  },
  actions: {
    label: "Actions",
    description: "Defining action items...",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    activeColor: "bg-green-100 text-green-800 border-green-300",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-green-50 hover:text-green-700",
  },
};

const phaseOrder: BoardPhase[] = ["gathering", "grouping", "voting", "actions"];

export function PhaseIndicator({
  phase,
  onPhaseChange,
  showControls = false,
}: PhaseIndicatorProps) {
  const canChangePhase = showControls && !!onPhaseChange;

  return (
    <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/30">
      {phaseOrder.map((phaseKey) => {
        const config = phaseConfig[phaseKey];
        const isActive = phase === phaseKey;

        return (
          <button
            key={phaseKey}
            onClick={() => canChangePhase && onPhaseChange?.(phaseKey)}
            disabled={!canChangePhase}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? config.activeColor + " shadow-sm"
                : config.inactiveColor +
                    (canChangePhase ? " cursor-pointer" : " cursor-default"),
              !canChangePhase && "opacity-60"
            )}
            title={config.description}
          >
            {config.icon}
            <span className="hidden sm:inline">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
