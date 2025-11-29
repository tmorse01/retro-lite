"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export default function NewBoardPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: teamName.trim()
            ? `${title.trim()} – ${teamName.trim()}`
            : title.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/board/${data.id}`);
      } else {
        alert("Failed to create board. Please try again.");
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="text-2xl font-bold text-primary">
            RetroLite
          </Link>
          <h1 className="text-2xl font-semibold">Create New Retro Board</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new retrospective board for your team
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg border"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Retro Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sprint 42 Retro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team Name (Optional)</Label>
            <Input
              id="team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., API Team"
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <div className="p-3 bg-muted rounded-md text-sm">
              Default: Went Well / Needs Improvement / Action Items
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Board"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
