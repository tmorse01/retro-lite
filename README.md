# RetroLite

A super lightweight sprint retrospective board app built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- 🚀 **Fast Setup** - Create a board in seconds
- 👥 **Live Collaboration** - Real-time updates via Supabase Realtime
- 👍 **Vote Prioritization** - Upvote cards to focus on what matters
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Built with shadcn/ui components

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (free tier works)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd retro-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor
   - Copy your project URL and anon key

4. Create environment variables:
```bash
cp .env.example .env.local
```

5. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
retro-lite/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── board/             # Board pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── CardItem.tsx       # Card component
│   ├── Column.tsx         # Column component
│   ├── EmptyState.tsx     # Empty state component
│   └── ShareBoardDialog.tsx
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase client setup
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript types
│   └── database.ts        # Database types
└── supabase/              # Database schema
    └── schema.sql         # SQL schema
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Setup

1. Create a Supabase project
2. Run the SQL from `supabase/schema.sql` in the Supabase SQL Editor
3. Enable Realtime for the `cards` and `columns` tables in Supabase Dashboard

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Roadmap

- [ ] Realtime collaboration (Supabase subscriptions)
- [ ] Export functionality (Markdown export)
- [ ] Board templates
- [ ] Private boards with authentication
- [ ] Advanced voting (prevent duplicate votes)

## License

MIT

