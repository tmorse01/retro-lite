import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">RetroLite</h1>
            <nav className="flex gap-4">
              <Link href="/board/new" className="text-sm text-muted-foreground hover:text-foreground">
                Start a Retro
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-4">Run focused retros in minutes</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create a retro board, invite your team, capture feedback, and prioritize actions without the bloat.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/board/new">Start a Retro</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/board/demo">View Demo Board</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Setup</h3>
              <p className="text-muted-foreground">Create a board in seconds and get your team collaborating immediately.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Live Collaboration</h3>
              <p className="text-muted-foreground">Everyone adds cards at once. See updates in real-time as your team participates.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👍</div>
              <h3 className="text-xl font-semibold mb-2">Prioritize with Votes</h3>
              <p className="text-muted-foreground">Focus on what matters. Upvote cards to highlight the most important feedback.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

