"use client";

import { useMemo } from "react";
import { BoardView } from "@/components/board/BoardView";
import type {
  Card,
  Column as ColumnType,
  BoardWithDetails,
} from "@/types/database";
import { DEFAULT_TEMPLATE } from "@/lib/board-templates";

// Mock data for demo board
const mockColumns: ColumnType[] = DEFAULT_TEMPLATE.columns.map(
  (title, index) => ({
    id: `col-${index + 1}`,
    board_id: "demo",
    title,
    sort_order: index,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
);

const initialCards: Card[] = [
  {
    id: "card-1",
    board_id: "demo",
    column_id: "col-1",
    content:
      "The collaboration with the design team has been exceptional this sprint. We established a weekly design review session where we could discuss implementation details early, which prevented several potential issues before they reached development. The designers were very responsive to feedback and made adjustments quickly, which kept our velocity high. Having them involved in our daily standups also helped bridge the gap between design intent and technical reality.",
    author: "Alice",
    votes: 3,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-2",
    board_id: "demo",
    column_id: "col-1",
    content:
      "Our CI pipeline improvements have made a huge difference in developer experience. We reduced build times from 15 minutes to under 3 minutes by implementing parallel test execution and better caching strategies. The new pipeline also provides much clearer feedback when tests fail, showing exactly which tests failed and why, rather than just a generic error message. This has significantly reduced the time developers spend debugging CI issues.",
    author: "Bob",
    votes: 5,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-3",
    board_id: "demo",
    column_id: "col-1",
    content:
      "The code review process has become much more efficient. We implemented a new policy where PRs are automatically assigned to two reviewers based on code ownership and expertise, which eliminated the 'who should review this?' confusion. We also started using review templates that guide reviewers on what to look for, making reviews more consistent and thorough. The average time from PR creation to merge has dropped from 2 days to under 6 hours.",
    author: "Sarah",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-4",
    board_id: "demo",
    column_id: "col-1",
    content:
      "Our new automated testing strategy has caught several critical bugs before they reached production. We increased our test coverage from 45% to 78% and added integration tests for our most critical user flows. The test suite now runs automatically on every commit and blocks merges if any tests fail. This has given the team much more confidence when deploying, and we've seen a 60% reduction in production bugs since implementing this.",
    author: "Mike",
    votes: 2,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-5",
    board_id: "demo",
    column_id: "col-2",
    content:
      "We've been experiencing too many last-minute scope changes that disrupt our sprint planning. Product managers are frequently coming to us mid-sprint with 'urgent' requests that require us to drop planned work. This creates a lot of context switching and makes it difficult to deliver on our commitments. We need a better process for handling urgent requests that doesn't completely derail our sprint goals. Perhaps we could establish a small buffer in each sprint for urgent items, or have a separate 'hotfix' process that doesn't impact sprint velocity.",
    author: "Charlie",
    votes: 4,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-6",
    board_id: "demo",
    column_id: "col-2",
    content:
      "The acceptance criteria for user stories are often too vague or incomplete. Developers frequently have to go back to product managers to clarify requirements, which creates delays and frustration on both sides. We need a standardized template for user stories that includes clear acceptance criteria, edge cases, and success metrics. It would also help if product managers could review stories with the tech lead before they're added to the sprint backlog to catch these issues early.",
    author: "Diana",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-7",
    board_id: "demo",
    column_id: "col-2",
    content:
      "Our documentation is scattered across multiple platforms (Confluence, GitHub wikis, Google Docs, Slack threads) making it very difficult to find information when needed. When onboarding new team members, we spend a lot of time just trying to locate the right documentation. We should consolidate our documentation into a single source of truth and establish clear guidelines on what should be documented and where. A documentation audit would also help identify gaps and outdated information that needs to be updated or removed.",
    author: "Emma",
    votes: 1,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-8",
    board_id: "demo",
    column_id: "col-2",
    content:
      "The deployment process is still too manual and error-prone. We have multiple steps that require manual intervention, and it's easy to miss a step or do them in the wrong order. This has led to several production incidents where we forgot to run migrations or update configuration. We should automate the entire deployment pipeline so that deployments are consistent and repeatable. This would also reduce the time spent on deployments and free up developers to work on features instead of babysitting deployments.",
    author: "James",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-9",
    board_id: "demo",
    column_id: "col-3",
    content:
      "We should implement a 'definition of ready' checklist that all user stories must meet before they can be added to a sprint. This would include things like: clear acceptance criteria, design mockups reviewed, technical feasibility confirmed, dependencies identified, and estimated story points. This would prevent us from starting work on stories that aren't actually ready, which has been a recurring problem. The checklist could be enforced in our project management tool so stories literally can't be moved to 'In Progress' until all criteria are met.",
    author: "Eve",
    votes: 5,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-10",
    board_id: "demo",
    column_id: "col-3",
    content:
      "Establishing a weekly sync meeting between engineering and product teams would help improve communication and alignment. Currently, we only interact during sprint planning and when issues arise, which means we're often working with outdated context. A regular 30-minute sync would give us a chance to discuss upcoming features, clarify requirements, and address any concerns before they become blockers. This could replace some of the ad-hoc Slack conversations and make communication more structured and efficient.",
    author: "Frank",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-11",
    board_id: "demo",
    column_id: "col-3",
    content:
      "We should create a 'tech debt backlog' that we can pull from during slower periods or when we have extra capacity. Currently, tech debt items get lost in the regular backlog and are rarely prioritized. Having a separate backlog would make it easier to track and address technical debt systematically. We could also allocate a percentage of each sprint (maybe 10-20%) specifically for tech debt, ensuring we're continuously improving our codebase rather than letting it accumulate indefinitely.",
    author: "Grace",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-12",
    board_id: "demo",
    column_id: "col-3",
    content:
      "Implementing a 'lunch and learn' program where team members can share knowledge about new technologies, best practices, or interesting problems they've solved would help spread expertise across the team. This could be done monthly and would help everyone stay up to date with industry trends and learn from each other's experiences. We could rotate presenters so everyone gets a chance to share, and topics could range from technical deep-dives to process improvements. This would also help with team bonding and creating a learning culture.",
    author: "Henry",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "card-13",
    board_id: "demo",
    column_id: "col-3",
    content:
      "We should establish a 'production readiness' checklist that all features must pass before they can be deployed. This would include things like: monitoring and alerting set up, error handling implemented, performance tested, security reviewed, and rollback plan documented. Having this checklist would ensure we don't deploy features that aren't ready for production, which has been a source of several incidents. The checklist could be part of our PR template so it's reviewed as part of the code review process.",
    author: "Iris",
    votes: 0,
    group_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DemoBoardPage() {
  // Create initial mock board object
  const initialBoard = useMemo<BoardWithDetails>(
    () => ({
      id: "demo",
      title: "Demo Retro Board",
      invite_code: null,
      phase: "gathering",
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      columns: mockColumns,
      cards: initialCards,
      groups: [],
    }),
    []
  );

  return <BoardView boardId="demo" isDemo={true} initialData={initialBoard} />;
}
