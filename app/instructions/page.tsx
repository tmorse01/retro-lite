import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Lightbulb, Group, Vote, CheckCircle2, ArrowLeft } from "lucide-react";

export default function InstructionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                RetroLite
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold">Instructions</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Sprint Retrospective Guide</h2>
            <p className="text-lg text-muted-foreground">
              A sprint retrospective is a team meeting held at the end of a
              sprint to reflect on what went well, what could be improved, and
              what actions to take. This guide will help you understand how to
              use RetroLite effectively.
            </p>
          </section>

          {/* Phases Overview */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">The Four Phases</h2>
            <p className="text-muted-foreground">
              RetroLite uses a structured four-phase workflow to guide your team
              through a productive retrospective. Each phase has a specific
              purpose and helps ensure you capture feedback, organize it,
              prioritize it, and turn it into actionable items.
            </p>

            {/* Phase 1: Gathering */}
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phase 1: Gathering</h3>
                  <p className="text-sm text-muted-foreground">
                    Gathering ideas...
                  </p>
                </div>
              </div>
              <div className="space-y-3 pl-12">
                <div>
                  <h4 className="font-medium mb-2">Purpose</h4>
                  <p className="text-muted-foreground">
                    This is the brainstorming phase where all team members
                    freely add their thoughts, observations, and feedback to the
                    board. There are no restrictions—everyone can add, edit, or
                    delete cards as ideas come to mind.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What to Do</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Add cards to the appropriate columns (e.g., "Went Well",
                      "Needs Improvement")
                    </li>
                    <li>Be specific and concise—one idea per card</li>
                    <li>Encourage everyone to participate</li>
                    <li>Don't worry about duplicates or organization yet</li>
                    <li>
                      Set a time limit (typically 5-10 minutes) to keep the
                      session focused
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips for Facilitators</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Remind participants to focus on the sprint that just ended
                    </li>
                    <li>Encourage honest feedback in a safe environment</li>
                    <li>
                      Keep the energy positive—even "Needs Improvement" items
                      are opportunities
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2: Grouping */}
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  <Group className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phase 2: Grouping</h3>
                  <p className="text-sm text-muted-foreground">
                    Grouping related items...
                  </p>
                </div>
              </div>
              <div className="space-y-3 pl-12">
                <div>
                  <h4 className="font-medium mb-2">Purpose</h4>
                  <p className="text-muted-foreground">
                    Organize the collected feedback by grouping related cards
                    together. This helps identify common themes, reduces
                    duplication, and makes it easier to see patterns in the
                    team's feedback.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What to Do</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Select multiple cards that address similar topics or
                      themes
                    </li>
                    <li>
                      Create groups with descriptive names that capture the
                      theme
                    </li>
                    <li>
                      Review each group to ensure cards truly belong together
                    </li>
                    <li>Move cards between groups if needed</li>
                    <li>Ungroup cards if they don't fit well with others</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips for Facilitators</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Encourage discussion about why cards should be grouped
                      together
                    </li>
                    <li>
                      Look for patterns like "communication issues" or
                      "deployment challenges"
                    </li>
                    <li>Don't force grouping—some cards may stand alone</li>
                    <li>
                      Aim for 3-7 groups per column to keep things manageable
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3: Voting */}
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  <Vote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phase 3: Voting</h3>
                  <p className="text-sm text-muted-foreground">
                    Voting on priorities...
                  </p>
                </div>
              </div>
              <div className="space-y-3 pl-12">
                <div>
                  <h4 className="font-medium mb-2">Purpose</h4>
                  <p className="text-muted-foreground">
                    Prioritize the most important items by allowing team members
                    to vote on cards or groups. This helps the team focus on
                    what matters most and ensures limited time and resources are
                    spent on high-impact improvements.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What to Do</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Review all cards and groups before voting</li>
                    <li>
                      Vote on items that you believe are most important to
                      address
                    </li>
                    <li>
                      Consider impact, urgency, and feasibility when voting
                    </li>
                    <li>Cards with the most votes will appear at the top</li>
                    <li>
                      You can vote on multiple items—focus on what matters to
                      you
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips for Facilitators</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Consider setting a vote limit (e.g., "You have 5 votes")
                      to encourage strategic thinking
                    </li>
                    <li>
                      Remind the team that voting is about prioritization, not
                      agreement
                    </li>
                    <li>
                      Use the vote counts to guide discussion on top items
                    </li>
                    <li>
                      If there's a tie, facilitate a brief discussion to break
                      it
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 4: Actions */}
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phase 4: Actions</h3>
                  <p className="text-sm text-muted-foreground">
                    Defining action items...
                  </p>
                </div>
              </div>
              <div className="space-y-3 pl-12">
                <div>
                  <h4 className="font-medium mb-2">Purpose</h4>
                  <p className="text-muted-foreground">
                    Convert the highest-priority feedback into concrete,
                    actionable items. This phase ensures that insights from the
                    retrospective translate into real improvements for the next
                    sprint.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What to Do</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Focus on the highest-voted items from the previous phase
                    </li>
                    <li>
                      Create specific, actionable items in the "Action Items"
                      column
                    </li>
                    <li>Make sure each action item is clear and achievable</li>
                    <li>
                      Consider assigning owners and due dates for each action
                    </li>
                    <li>
                      Limit the number of action items to 2-5 to ensure focus
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips for Facilitators</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Ensure each action item has a clear owner who commits to
                      it
                    </li>
                    <li>
                      Make action items SMART: Specific, Measurable, Achievable,
                      Relevant, Time-bound
                    </li>
                    <li>
                      Document action items in your project management tool
                    </li>
                    <li>
                      Review action items from the previous retrospective at the
                      start of the next one
                    </li>
                    <li>
                      Celebrate completed actions to show progress and value
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Best Practices</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Time Management</h3>
                <p className="text-muted-foreground">
                  Keep retrospectives focused and time-boxed. A typical
                  retrospective should last 60-90 minutes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Gathering: 10-15 minutes</li>
                  <li>Grouping: 10-15 minutes</li>
                  <li>Voting: 5-10 minutes</li>
                  <li>Actions: 15-20 minutes</li>
                  <li>Buffer time: 10-15 minutes</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Creating a Safe Environment</h3>
                <p className="text-muted-foreground">
                  Retrospectives work best when team members feel safe to share
                  honest feedback:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Focus on processes and systems, not individuals</li>
                  <li>Use "I" statements and avoid blame</li>
                  <li>Encourage constructive feedback</li>
                  <li>Respect different perspectives</li>
                  <li>Follow up on action items to show their value</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Facilitation Tips</h3>
                <p className="text-muted-foreground">
                  As a facilitator, your role is to guide the process:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Set clear expectations at the start</li>
                  <li>Keep the conversation focused and on track</li>
                  <li>Ensure everyone has a chance to participate</li>
                  <li>Move through phases at an appropriate pace</li>
                  <li>Capture key insights and decisions</li>
                  <li>End on a positive note, celebrating wins</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Follow-Up</h3>
                <p className="text-muted-foreground">
                  The retrospective doesn't end when the meeting does:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Share action items with the team and stakeholders</li>
                  <li>
                    Add action items to your sprint backlog or project
                    management tool
                  </li>
                  <li>
                    Review progress on action items in the next retrospective
                  </li>
                  <li>
                    Celebrate improvements and acknowledge when things get
                    better
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Questions */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Common Questions</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">
                  How long should each phase last?
                </h3>
                <p className="text-muted-foreground">
                  This depends on your team size and the amount of feedback.
                  Generally, allow 10-15 minutes for gathering, 10-15 minutes
                  for grouping, 5-10 minutes for voting, and 15-20 minutes for
                  actions. Adjust based on your team's needs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Can we skip phases?</h3>
                <p className="text-muted-foreground">
                  While you can technically skip phases, each phase serves a
                  purpose. Skipping grouping might make voting harder, and
                  skipping voting might lead to less focused action items.
                  However, feel free to adapt the process to your team's needs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">
                  What if we have too many action items?
                </h3>
                <p className="text-muted-foreground">
                  Focus on the top 2-5 action items based on votes. Too many
                  action items can lead to none being completed. It's better to
                  do a few things well than many things poorly.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">
                  Should we review action items from the previous retro?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Start each retrospective by reviewing the action items
                  from the previous one. This shows progress, holds people
                  accountable, and helps the team see the value of
                  retrospectives.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t pt-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                Ready to Run Your Retrospective?
              </h2>
              <p className="text-muted-foreground">
                Create a new board and start gathering feedback from your team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/board/new">
                  <Button size="lg">Start a Retro</Button>
                </Link>
                <Link href="/board/demo">
                  <Button size="lg" variant="outline">
                    View Demo Board
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© 2024 RetroLite</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link
              href="/instructions"
              className="hover:text-foreground transition-colors"
            >
              Instructions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
