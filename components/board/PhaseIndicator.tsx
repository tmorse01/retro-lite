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
    activeColor:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400",
  },
  grouping: {
    label: "Grouping",
    description: "Grouping related items...",
    icon: <Group className="h-3.5 w-3.5" />,
    activeColor:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400",
  },
  voting: {
    label: "Voting",
    description: "Voting on priorities...",
    icon: <Vote className="h-3.5 w-3.5" />,
    activeColor:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400",
  },
  actions: {
    label: "Actions",
    description: "Defining action items...",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    activeColor:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700",
    inactiveColor:
      "bg-transparent text-muted-foreground border-transparent hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400",
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
