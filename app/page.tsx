import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              RetroLite
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
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
                Create a retro board, invite your team, capture feedback, and
                prioritize actions without the bloat.
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
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  View Demo Board
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section with Screenshots */}
        <div className="w-full bg-muted/30 py-16 px-4">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Main Board Overview */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Organize Your Retrospective
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Three-column layout helps structure your team's feedback into
                  what went well, what needs improvement, and actionable next
                  steps.
                </p>
              </div>
              <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
                <Image
                  src="/screenshots/board-overview.png"
                  alt="RetroLite board view showing three columns with cards"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </section>

            {/* Feature Highlights with Screenshots */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Fast Setup */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Fast Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a board in seconds and get your team collaborating
                    immediately. No complex setup or configuration needed.
                  </p>
                </div>
              </div>

              {/* Live Collaboration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Live Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Everyone adds cards at once. See updates in real-time as
                    they happen. Perfect for remote teams.
                  </p>
                </div>
              </div>

              {/* Prioritize with Votes */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Prioritize with Votes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on what matters most. Upvote cards to surface the most
                    important feedback and drive meaningful discussions.
                  </p>
                </div>
              </div>
            </div>

            {/* Phased Workflow */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Structured Workflow
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Guide your retrospective through four clear phases: Gathering
                  ideas, Grouping related items, Voting on priorities, and
                  Defining actions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
                    <Image
                      src="/screenshots/voting-phase.png"
                      alt="Voting phase showing cards with vote counts"
                      width={1920}
                      height={1080}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Voting Phase</h3>
                    <p className="text-sm text-muted-foreground">
                      Team members vote on the most important items. Cards are
                      automatically sorted by vote count to highlight
                      priorities.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
                    <Image
                      src="/screenshots/grouping-phase.png"
                      alt="Grouping phase showing related cards grouped together"
                      width={1920}
                      height={1080}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Grouping Phase</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize related feedback into groups. Select multiple
                      cards and create groups to identify common themes and
                      patterns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="rounded-lg border bg-card p-4 shadow-lg">
                  <Image
                    src="/screenshots/phase-indicators.png"
                    alt="Phase indicator showing Gathering, Grouping, Voting, and Actions phases"
                    width={600}
                    height={100}
                    className="w-full h-auto max-w-md"
                  />
                </div>
              </div>
            </section>
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
