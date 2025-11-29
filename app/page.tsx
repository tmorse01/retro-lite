import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              RetroLite
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Run focused retros in minutes.
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a retro board, invite your team, capture feedback, and prioritize actions without the bloat.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/board/new">
              <Button size="lg" className="w-full sm:w-auto">
                Start a Retro
              </Button>
            </Link>
            <Link href="/board/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Demo Board
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Fast Setup</h3>
              <p className="text-sm text-muted-foreground">
                Create a board in seconds and get your team collaborating immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Live Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Everyone adds cards at once. See updates in real-time as they happen.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Prioritize with Votes</h3>
              <p className="text-sm text-muted-foreground">
                Focus on what matters most. Upvote cards to surface the most important feedback.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© 2024 RetroLite</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

