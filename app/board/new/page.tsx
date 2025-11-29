"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          title: teamName ? `${title} - ${teamName}` : title,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/board/${data.id}`);
      } else {
        // For now, redirect to demo if API not ready
        router.push("/board/demo");
      }
    } catch (error) {
      // Fallback to demo board if API not ready
      router.push("/board/demo");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            RetroLite
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold mb-6">Create a Retro Board</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Retro Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Sprint 42 Retro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium mb-2">
                Team Name (optional)
              </label>
              <Input
                id="teamName"
                type="text"
                placeholder="e.g., API Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="template" className="block text-sm font-medium mb-2">
                Template
              </label>
              <select
                id="template"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="default"
              >
                <option value="default">Went Well / Needs Improvement / Action Items</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Board"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

