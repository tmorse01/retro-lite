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
    activeColor: "bg-primary/10 text-primary border-primary/30",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-primary/5 hover:text-primary",
  },
  grouping: {
    label: "Grouping",
    description: "Grouping related items...",
    icon: <Group className="h-3.5 w-3.5" />,
    activeColor: "bg-accent/10 text-accent-foreground border-accent/30",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-accent/5 hover:text-accent-foreground",
  },
  voting: {
    label: "Voting",
    description: "Voting on priorities...",
    icon: <Vote className="h-3.5 w-3.5" />,
    activeColor: "bg-primary/10 text-primary border-primary/30",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-primary/5 hover:text-primary",
  },
  actions: {
    label: "Actions",
    description: "Defining action items...",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    activeColor: "bg-accent/10 text-accent-foreground border-accent/30",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-accent/5 hover:text-accent-foreground",
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
